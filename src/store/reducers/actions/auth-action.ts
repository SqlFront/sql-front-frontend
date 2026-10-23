import { isAxiosError } from "axios";

import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  DataLoginType,
  DataRegisterType,
  DataResetPasswordType,
  LoginResponseType,
  ResetPasswordResponseType,
} from "@/shared/types/auth-data-types";
import api from "@/shared/config/axios";
import strings from "@/shared/consts/strings";

import { tokenService } from "@/shared/config/token-service";

export const registerUser = createAsyncThunk(
  "user/register",
  async (userData: DataRegisterType, { rejectWithValue }) => {
    try {
      await api.post(strings.api.register, userData);
    } catch (err) {
      if (isAxiosError(err)) {
        return rejectWithValue(err.response?.data);
      }
      return rejectWithValue(strings.unexpectedError);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (userData: DataLoginType, { rejectWithValue }) => {
    try {
      const response = await api.post<LoginResponseType>(strings.api.login, userData);
      tokenService.set(response.data.access_token);
      return response.data;
    } catch (err) {
      if (isAxiosError(err)) {
        return rejectWithValue(err.response?.data);
      }
      return rejectWithValue(strings.unexpectedError);
    }
  }
);

export const resetPasswordUser = createAsyncThunk(
  "user/resetPassword",
  async (userData: DataResetPasswordType, { rejectWithValue }) => {
    try {
      const response = await api.post<ResetPasswordResponseType>(strings.api.resetPassword, userData);
      return response.data;
    } catch (err) {
      if (isAxiosError(err)) {
        return rejectWithValue(err.response?.data);
      }
      return rejectWithValue(strings.unexpectedError);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post(strings.api.logout);
    } catch (err) {
      if (isAxiosError(err)) {
        return rejectWithValue(err.response?.data);
      }
      return rejectWithValue(strings.unexpectedError);
    }
  }
);
