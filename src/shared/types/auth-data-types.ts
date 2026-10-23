export type AuthType = "login" | "register" | "reset";

export type DataRegisterType = {
  fullname?: string;
  group?: string;
  email: string;
  login: string;
  password: string;
};

export type DataLoginType = {
  login: string;
  password: string;
};

export type LoginResponseType = {
  access_token: string;
};

export type DataResetPasswordType = {
  login: string;
  email: string;
  new_password: string;
};

export type ResetPasswordResponseType = {
  message: string;
};
