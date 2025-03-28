
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { mockQueryProcessor } from '../utils/mockData';

export interface Query {
  id: string;
  text: string;
  timestamp: number;
}

export interface QueryResult {
  queryId: string;
  data: any;
  error: string | null;
}

interface QueryState {
  queries: Query[];
  activeQueryId: string | null;
  results: Record<string, QueryResult>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: QueryState = {
  queries: [],
  activeQueryId: null,
  results: {},
  status: 'idle',
  error: null,
};

export const processQuery = createAsyncThunk(
  'query/process',
  async (query: Query) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const result = await mockQueryProcessor(query.text);
    return { queryId: query.id, result };
  }
);

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    addQuery: (state, action: PayloadAction<Query>) => {
      state.queries.unshift(action.payload);
      state.activeQueryId = action.payload.id;
    },
    setActiveQuery: (state, action: PayloadAction<string>) => {
      state.activeQueryId = action.payload;
    },
    clearQueries: (state) => {
      state.queries = [];
      state.results = {};
      state.activeQueryId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(processQuery.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(processQuery.fulfilled, (state, action) => {
        const { queryId, result } = action.payload;
        state.status = 'succeeded';
        state.results[queryId] = {
          queryId,
          data: result.data,
          error: result.error,
        };
      })
      .addCase(processQuery.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export const { addQuery, setActiveQuery, clearQueries } = querySlice.actions;
export default querySlice.reducer;
