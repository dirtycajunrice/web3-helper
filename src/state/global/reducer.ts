import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GlobalState } from '@state/global/types';

const initialState: GlobalState = {
  loading: false
}

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  }
})

export const {
  setGlobalLoading,
} = globalSlice.actions;

export default globalSlice.reducer;
