import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isAuth: false,
  AsyncValue: {},
};

const Authentication = createSlice({
  name: 'Authentication',
  initialState: initialState,
  reducers: {
    onAuthChange: (state, action) => {
      state.isAuth = action.payload;
    },
    setAsyncStorageValue: (state, action) => {
      state.AsyncValue = action.payload;
    },
  },
});

export const {onAuthChange, setAsyncStorageValue} = Authentication.actions;

export default Authentication.reducer;
