import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { AuthType } from "@/shared/types/auth-data-types";
import { colors } from "@/shared/ui/colors";
import { Form } from "@/shared/ui/form-auth/form-auth";
import { Title } from "@/shared/ui/title/title";
import { Link } from "@/shared/ui/link/link";

import styles from "./auth.module.scss";

const authConfig = {
  login: {
    color: "red",
    linkColor: colors.black,
    colorLinkHover: colors.red,
  },
  register: {
    color: "white",
    linkColor: colors.white,
    colorLinkHover: colors.grayMid,
  },
  reset: {
    color: "white",
    linkColor: colors.white,
    colorLinkHover: colors.grayMid,
  },
} as const;

export const Auth = () => {
  const params = useSearchParams();
  const authType = (params.get("type") as AuthType) || "login";
  const config = authConfig[authType] || authConfig.login;

  const makeAuth = useCallback((type: AuthType) => {
    const existingParams = params.toString();
    const newSearchParams = new URLSearchParams(existingParams);
    newSearchParams.set("type", type);
    return `/auth?${newSearchParams.toString()}`;
  }, [params]);

  return (
    <section
      className={styles[authType] || styles.login}
      style={{
        "--link-color": config.linkColor,
        "--link-hover-color": config.colorLinkHover,
      } as React.CSSProperties}
    >
      <div className={styles.menu}>
        {authType === "login" && (
          <Link href={makeAuth("register")} size="1vw">Зарегистрироваться</Link>
        )}
        {authType === "register" && (
          <Link href={makeAuth("login")} size="1vw">Войти</Link>
        )}
        {authType === "reset" && (
          <Link href={makeAuth("login")} size="1vw">Войти</Link>
        )}
      </div>
      <Title
        as="p"
        size="30vw"
        padding="3vw 0 0 5vw"
        color={config.color}
      >
        SQL
      </Title>
      <Title
        as="p"
        size="18vw"
        margin="-2.4vw 0 0 2.4vw"
        color={config.color}
      >
        фронт
      </Title>
      <Form type={authType}/>
    </section>
  );
};
