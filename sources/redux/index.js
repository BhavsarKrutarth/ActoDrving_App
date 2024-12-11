import { configureStore } from '@reduxjs/toolkit';
import CategoryReducer from './Reducers/CategoryReducer';
import QuizReducer from './Reducers/QuizReducer';
import AuthReducers from './Reducers/AuthReducers';
import TopicReducer from './Reducers/TopicReducer';
import MistakeReducers from './Reducers/MistakeReducers';

const Store = configureStore({
  reducer: {
    Category : CategoryReducer,
    Quiz : QuizReducer,
    Topic : TopicReducer,
    Authentication: AuthReducers,
    Mistake: MistakeReducers,
  },
});

export default Store;
