import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import courseService from '../../services/courseService';

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async () => {
    const response = await courseService.getCourses();
    return response.data;
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default courseSlice.reducer;
