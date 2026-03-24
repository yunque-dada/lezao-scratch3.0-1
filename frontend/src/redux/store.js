/**
 * Redux store 配置
 */
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import workReducer from './slices/workSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
    work: workReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;
