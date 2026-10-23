export const formFieldsReset = [
  {
    name: "login",
    label: "Логин",
    type: "text",
    rules: {
      required: "Введите логин",
      pattern: {
        value: /^[a-zA-Z][a-zA-Z0-9_-]{1,28}[a-zA-Z0-9]$/,
        message: "Неверный логин",
      },
    },
  },
  {
    name: "email",
    label: "Почта",
    type: "text",
    rules: {
      required: "Введите почту",
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Некорректная почта",
      },
    },
  },
  {
    name: "new_password",
    label: "Новый пароль",
    type: "password",
    rules: {
      required: "Введите новый пароль",
      pattern: {
        value: /^.{8,}$/,
        message: "Введите пароль от 8 символов",
      },
    },
  },
  {
    name: "confirm_password",
    label: "Повторите пароль",
    type: "password",
    rules: {
      required: "Повторите новый пароль",
      pattern: {
        value: /^.{8,}$/,
        message: "Введите пароль от 8 символов",
      },
    },
  },
] as const;
