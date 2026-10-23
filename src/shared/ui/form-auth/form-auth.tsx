import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { AuthType } from "@/shared/types/auth-data-types";
import { colors } from "@/shared/ui/colors";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { loginUser, registerUser, resetPasswordUser } from "@/store/reducers/actions/auth-action";

import { formFieldsLogin } from "./form-fields-login";
import { formFieldsRegister } from "./form-fields-register";
import { formFieldsReset } from "./form-fields-reset";
import { Error } from "../form/error/error";
import { Button } from "../button/button";
import { Link } from "../link/link";
import styles from "./form-auth.module.scss";

type FormType = {
  [_ in (typeof formFieldsLogin | typeof formFieldsRegister | typeof formFieldsReset)[number]["name"]]?: string;
};

const formConfig = {
  login: {
    formFields: formFieldsLogin,
    textColor: colors.black,
    underlineFocusColor: colors.red,
    errorColor: "red" as keyof typeof colors,
    submitButton: {
      text: "Войти",
      width: "8vw",
      padding: "0.3vw",
      color: "black" as keyof typeof colors,
    },
  },
  register: {
    formFields: formFieldsRegister,
    textColor: colors.white,
    underlineFocusColor: colors.grayMid,
    errorColor: "grayMid" as keyof typeof colors,
    submitButton: {
      text: "Зарегистрироваться",
      width: "16vw",
      padding: "0.4vw",
      color: "white" as keyof typeof colors,
    },
  },
  reset: {
    formFields: formFieldsReset,
    textColor: colors.white,
    underlineFocusColor: colors.grayMid,
    errorColor: "grayMid" as keyof typeof colors,
    submitButton: {
      text: "Обновить пароль",
      width: "16vw",
      padding: "0.4vw",
      color: "white" as keyof typeof colors,
    },
  },
};

export const Form = ({ type }: { type: AuthType }) => {
  const dispatch = useAppDispatch();
  const config = formConfig[type] || formConfig.login;
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  const { register, handleSubmit, formState: { errors, isValid, isDirty } } = useForm<FormType>({
    mode: "onChange",
  });

  const onSubmit = useCallback(async (data: FormType) => {
    setAuthError(null);
    try {
      if (type === "login") {
        await dispatch(loginUser({ login: data.login!, password: data.password! })).unwrap();
        router.push("/profile");
      } else if (type === "register") {
        await dispatch(registerUser({
          fullname: data.fullname,
          group: data.group,
          email: data.email!,
          login: data.login!,
          password: data.password!,
        })).unwrap();
        toast.success("Регистрация успешна! Войдите в аккаунт.");
        router.push("auth?type=login");
      } else if (type === "reset") {
        if (data.new_password !== data.confirm_password) {
          const mismatchError = "Пароли не совпадают";
          setAuthError(mismatchError);
          toast.error(mismatchError);
          return;
        }

        await dispatch(resetPasswordUser({
          login: data.login!,
          email: data.email!,
          new_password: data.new_password!,
        })).unwrap();
        toast.success("Пароль успешно изменён! Войдите с новым паролем");
        router.push("auth?type=login");
      }
    } catch (error: unknown) {
      let errorMessage = "Ошибка авторизации";
      if (typeof error === "string") {
        errorMessage = error;
      } else if (typeof error === "object" && error !== null) {
        const errObj = error as Record<string, unknown>;
        if (typeof errObj.detail === "string") {
          errorMessage = errObj.detail;
        } else if (Array.isArray(errObj.detail)) {
          errorMessage = errObj.detail
            .map((d: unknown) =>
              typeof d === "object" && d !== null && "msg" in d
                ? String((d as { msg: unknown }).msg)
                : String(d)
            )
            .join(", ");
        } else if (typeof errObj.message === "string") {
          errorMessage = errObj.message;
        }
      }

      setAuthError(errorMessage);
      toast.error(errorMessage);
      console.log("AUTH ERROR:", error);
    }
  }, [dispatch, type, router]);

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
    >
      {config.formFields.map((field) => (
        <div
          className={styles.inputWrapper}
          key={field.name}
          style={{
            "--text-color": config.textColor,
            "--underline-color": config.textColor,
            "--underline-focus-color": config.underlineFocusColor,
          } as React.CSSProperties}
        >
          <label htmlFor={field.name}>{field.label}</label>
          <input
            id={field.name}
            type={field.type}
            autoComplete="off"
            {...register(field.name, field.rules)}
          />
          {errors[field.name]?.message &&
            <Error
              message={errors[field.name]?.message}
              color={config.errorColor}
              gridColumn="2"
              gridRow="2"
            />
          }
        </div>
      ))}
      {type === "login" && (
        <div className={styles.forgotPassword}>
          <Link href="/auth?type=reset" size="0.9vw">
            Забыли пароль?
          </Link>
        </div>
      )}
      {authError && (
        <div style={{ position: "relative", minHeight: "1.2vw", textAlign: "right" }}>
          <Error
            message={authError}
            color={config.errorColor}
            right="0"
          />
        </div>
      )}
      {(isValid && isDirty) && (
        <Button
          color={config.submitButton.color}
          width={config.submitButton.width}
          padding={config.submitButton.padding}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Подождите..." : config.submitButton.text}
        </Button>
      )}
    </form>
  );
};
