import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mistakequesrtionsData: [],
  selectedmistakeData: null,
  mistakeResponse: [],
  selectedQuestion: null
};

const MistakeReducer = createSlice({
  name: 'Mistake',
  initialState,
  reducers: {
    SET_MISTAKEQUESTIONDATA: (state, action) => {
      state.mistakequesrtionsData = action.payload;
    },
    SET_SELECTED_MISTAKEQUESTIONDATA: (state, action) => {
      state.selectedmistakeData = action.payload;
    },
    SET_SELECTED_QUESTIONDATA: (state, action) => {
      state.selectedQuestion = action.payload;
    },
    ADD_MiSTAKEDATA: (state, action) => {
      const { loginID, vehicleID, QuizID, TopicID, isCorrect, questionIndex } = action.payload;
      let user = state.mistakeResponse.find(u => u.loginID === loginID);
      if (!user) {
        user = { loginID, vehicles: [] };
        state.mistakeResponse.push(user);
      }
      let vehicle = user.vehicles.find(v => v.vehicleID === vehicleID);
      if (!vehicle) {
        vehicle = { vehicleID, topic: [], quiz: [] };
        user.vehicles.push(vehicle);
      }

      let target = null;

      if (QuizID !== undefined) {
        let quiz = vehicle.quiz.find(q => q.QuizID === QuizID);
        if (!quiz) {
          quiz = { QuizID, rightQuestions: [], wrongQuestions: [] };
          vehicle.quiz.push(quiz);
        }
        target = quiz;
      } else if (TopicID !== undefined) {
        let topic = vehicle.topic.find(t => t.TopicID === TopicID);
        if (!topic) {
          topic = { TopicID, rightQuestions: [], wrongQuestions: []};
          vehicle.topic.push(topic);
        }
        target = topic;
      }

      if (target) {
        if (target.wrongQuestions.includes(questionIndex)) {
          target.wrongQuestions = target.wrongQuestions.filter(index => index !== questionIndex);
        }     
        if (isCorrect) {
          if (!target.rightQuestions.includes(questionIndex)) {
            target.rightQuestions.push(questionIndex);
          }
        } else {
          if (!target.wrongQuestions.includes(questionIndex)) {
            target.wrongQuestions.push(questionIndex);
          }
        }
        
        // target.QuestionCounter = QuestionCounter;
      }
    }
  }
});

export const { SET_MISTAKEQUESTIONDATA, SET_SELECTED_MISTAKEQUESTIONDATA, ADD_MiSTAKEDATA, SET_SELECTED_QUESTIONDATA } = MistakeReducer.actions;
export default MistakeReducer.reducer;
