import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quizData: [],
  selectedQuiz: null,
  questionData: [],
  selectedQuestion: null,
  userAnswers: [],
  QuestionCounter: [],
};

const QuizReducer = createSlice({
  name: "Quiz",
  initialState,
  reducers: {
    SET_QUIZDATA: (state, action) => {
      state.quizData = action.payload;
    },
    SET_SELECTED_QUIZDATA: (state, action) => {
      state.selectedQuiz = action.payload;
    },
    SET_QUESTIONDATA: (state, action) => {
      state.questionData = action.payload;
    },
    SET_SELECTED_QUESTIONDATA: (state, action) => {
      state.selectedQuestion = action.payload;
    },
    SET_CLEAR_QUESTIONDATA: (state, action) => {
      // (state.quizData = []),
      // (state.selectedQuiz = null),
      (state.questionData = []),
        //(state.selectedQuestion = null),
        //(state.userAnswers = []),
        (state.QuestionCounter = []);
    },
    ADD_ANSWER: (state, action) => {
      const {
        loginID,
        vehicleID,
        QuizID,
        TopicID,
        isCorrect,
        questionIndex,
        isTopic,
      } = action.payload;

      const questionIds = Array.isArray(questionIndex)
        ? questionIndex
        : [questionIndex];

      let user = state.userAnswers.find((u) => u.loginID === loginID);
      if (!user) {
        user = { loginID, vehicles: [] };
        state.userAnswers.push(user);
      }
      let vehicle = user.vehicles.find((v) => v.vehicleID === vehicleID);
      if (!vehicle) {
        vehicle = { vehicleID, topic: [], quiz: [] };
        user.vehicles.push(vehicle);
      }

      if (isTopic) {
        let topic = vehicle.topic.find((t) => t.topicID === TopicID);
        if (!topic) {
          topic = {
            topicID: TopicID,
            rightQuestions: [],
            wrongQuestions: [],
            QuestionCounter: 0,
          };
          vehicle.topic.push(topic);
        }

        if (isCorrect) {
          topic.wrongQuestions = topic.wrongQuestions.filter(
            (idx) => !questionIds.includes(idx)
          );
          topic.rightQuestions = [
            ...new Set([...topic.rightQuestions, ...questionIds]),
          ];
        } else {
          topic.rightQuestions = topic.rightQuestions.filter(
            (idx) => !questionIds.includes(idx)
          );
          topic.wrongQuestions = [
            ...new Set([...topic.wrongQuestions, ...questionIds]),
          ];
        }

        topic.QuestionCounter =
          topic.rightQuestions.length + topic.wrongQuestions.length;
      } else {
        let quiz = vehicle.quiz.find((q) => q.QuizID === QuizID);
        if (!quiz) {
          quiz = {
            QuizID: QuizID,
            rightQuestions: [],
            wrongQuestions: [],
            QuestionCounter: 0,
          };
          vehicle.quiz.push(quiz);
        }
        if (isCorrect) {
          quiz.wrongQuestions = quiz.wrongQuestions.filter(
            (idx) => !questionIds.includes(idx)
          );
          quiz.rightQuestions = [
            ...new Set([...quiz.rightQuestions, ...questionIds]),
          ];
        } else {
          quiz.rightQuestions = quiz.rightQuestions.filter(
            (idx) => !questionIds.includes(idx)
          );
          quiz.wrongQuestions = [
            ...new Set([...quiz.wrongQuestions, ...questionIds]),
          ];
        }
        quiz.QuestionCounter =
          quiz.rightQuestions.length + quiz.wrongQuestions.length;
      }
    },
    QUESTIONS_ANSWER: (state, action) => {
      state.data = action.payload;
      const {
        loginID,
        vehicleID,
        QuizID,
        TopicID,
        rightQuestions,
        wrongQuestions,
        isTopic,
        QuestionCounter,
      } = action.payload;

      const Data = [
        {
          loginID: loginID,
          vehicles: [
            {
              vehicleID: vehicleID,
              topic: isTopic
                ? [
                    {
                      TopicID: TopicID,
                      rightQuestions: rightQuestions,
                      wrongQuestions: wrongQuestions,
                      questionCounter: QuestionCounter,
                    },
                  ]
                : [], // Add topic details if needed
              quiz: !isTopic
                ? [
                    {
                      QuizID: QuizID,
                      // rightQuestions: isCorrect ? [questionIndex] : [],
                      // wrongQuestions: !isCorrect ? [questionIndex] : [],
                      rightQuestions: rightQuestions,
                      wrongQuestions: wrongQuestions,
                      questionCounter: QuestionCounter,
                    },
                  ]
                : [],
            },
          ],
        },
      ];
      state.data = Data;
    },
  },
});

export const {
  SET_QUIZDATA,
  SET_SELECTED_QUIZDATA,
  SET_QUESTIONDATA,
  SET_SELECTED_QUESTIONDATA,
  ADD_ANSWER,
  QUESTIONS_ANSWER,
  SET_CLEAR_QUESTIONDATA,
} = QuizReducer.actions;

export default QuizReducer.reducer;
