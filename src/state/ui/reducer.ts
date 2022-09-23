import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Component, UIState } from '@state/ui/types';

const initialState: UIState = {
  component: Component.None,
  theme: 'dark'
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setUiComponent: (state, action: PayloadAction<Component>) => {
      state.component = action.payload
    },
    clearUiComponent: state => {
      state.component = Component.None
    },
    toggleUITheme: state => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },
  }
})

export const {
  setUiComponent,
  clearUiComponent,
  toggleUITheme,
} = uiSlice.actions;

export default uiSlice.reducer;
