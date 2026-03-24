import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import workService from '../../services/workService';

export const fetchWorks = createAsyncThunk(
  'works/fetchWorks',
  async () => {
    const response = await workService.getWorks();
    return response.data;
  }
);

const workSlice = createSlice({
  name: 'works',
  initialState: {
    works: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorks.fulfilled, (state, action) => {
        state.loading = false;
        state.works = action.payload;
      })
      .addCase(fetchWorks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default workSlice.reducer;
