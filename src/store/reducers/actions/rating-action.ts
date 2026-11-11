import { isAxiosError } from "axios";

import { createAsyncThunk } from "@reduxjs/toolkit";

import { RatingTypeDto, UserRatingType } from "@/shared/types/rating-type";
import api from "@/shared/config/axios";
import strings from "@/shared/consts/strings";
import { StateType } from "@/store/store";

export const getRating = createAsyncThunk(
  "rating/get",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = (getState() as StateType);

      const ratingResponse = await api.get<RatingTypeDto>(strings.api.rating);

      let currentUser: UserRatingType | null = null;

      if (state.auth.token) {
        try {
          const currentUserResponse = await api.get<UserRatingType | null>(strings.api.ratingPersonal);
          currentUser = currentUserResponse.data;
        } catch {
          currentUser = null;
        }
      }

      return {
        ...ratingResponse.data,
        currentUser,
      };
      
    } catch (err) {
      if (isAxiosError(err)) {
        return rejectWithValue(err.response?.data);
      }
      
      return rejectWithValue(strings.unexpectedError);
    }
  }
);

