import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryData: [],
  selectedCategory: null,
};

const CategoryReducer = createSlice({
  name: 'Category',
  initialState,
  reducers: {
    SET_CATEGORYDATA: (state, action) => {
      state.categoryData = action.payload;
    },
    SET_SELECTED_CATEGORY: (state, action) => {
      state.selectedCategory = action.payload;
    }
  }
});

export const { SET_CATEGORYDATA, SET_SELECTED_CATEGORY } = CategoryReducer.actions;

export default CategoryReducer.reducer;
