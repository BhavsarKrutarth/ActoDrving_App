import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  topicData: [],
  selectedTopic: null,
  QuestionData: [],
  selectedQuestion: [],
  correctAnswers: [], 
  wrongAnswers: []  
};

const TopicReducer = createSlice({
  name: 'Topic',
  initialState,
  reducers: {
    SET_TOPICDATA: (state, action) => {
      state.topicData = action.payload;
    },
    SET_SELECTED_TOPICDATA: (state, action) => {
      state.selectedTopic = action.payload
    },
    SET_TOPICQUESTION_DATA: (state, action) => {
      state.QuestionData = action.payload
    },
    SET_SELECTED_TOPICQUESTION: (state, action) => {
      state.selectedQuestion = action.payload
    },
    ADD_CORRECT_ANSWER: (state, action) => {
      state.correctAnswers.push(action.payload);
    },
    ADD_WRONG_ANSWER: (state, action) => {
      state.wrongAnswers.push(action.payload);
    },
  }
});

export const { SET_TOPICDATA ,SET_SELECTED_TOPICDATA, SET_TOPICQUESTION_DATA, SET_SELECTED_TOPICQUESTION, ADD_CORRECT_ANSWER, ADD_WRONG_ANSWER } = TopicReducer.actions;

export default TopicReducer.reducer;

