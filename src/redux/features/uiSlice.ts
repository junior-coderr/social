import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  funMode: boolean;
  theme: 'light' | 'dark';
}

const initialState: UiState = {
  funMode: false,
  theme: 'light',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleFunMode: (state) => {
      state.funMode = !state.funMode;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleFunMode, setTheme } = uiSlice.actions;
export default uiSlice.reducer;