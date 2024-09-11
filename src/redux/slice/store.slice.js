import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/baseURL";
import { setAlert } from "./alert.slice";

const initialState = {
    Store: [],
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getstore = createAsyncThunk(
    'store/get',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.get(BASE_URL + '/allstores');
            return response.data.store;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const addstore = createAsyncThunk(
    'store/add',
    async (data, { dispatch, rejectWithValue }) => {
        console.log(data);
        try {
            const response = await axios.post(BASE_URL + '/createstore', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return response.data.store;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deletestore = createAsyncThunk(
    'store/delete',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.delete(`${BASE_URL}/deletestore/${id}`);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return id;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const editstore = createAsyncThunk(
    'store/edit',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const { _id, ...rest } = data;
            // console.log(data);
            const response = await axios.put(`${BASE_URL}/updatestore/${_id}`, rest, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            // console.log(response.data);
            return response.data.store;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const StoreSlice = createSlice({
    name: 'Store',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getstore.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching Store...';
            })
            .addCase(getstore.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || 'Store fetched successfully';
                state.Store = action.payload;
            })
            .addCase(getstore.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch Store';
            })
            .addCase(addstore.pending, (state) => {
                state.loading = true;
                state.message = 'Adding Store...';
            })
            .addCase(addstore.fulfilled, (state, action) => {
                // console.log(action.payload);
                state.loading = false;
                state.success = true;
                state.Store?.push(action.payload);
                state.message = action.payload?.message || 'Store added successfully';
            })
            .addCase(addstore.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to add Store';
            })
            .addCase(deletestore.pending, (state) => {
                state.loading = true;
                state.message = 'Deleting Store...';
            })
            .addCase(deletestore.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.Store = state.Store.filter((Term) => Term._id !== action.payload);
                state.message = action.payload?.message || 'Store deleted successfully';
            })
            .addCase(deletestore.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete Store';
            })
            .addCase(editstore.pending, (state) => {
                state.loading = true;
                state.message = 'Editing Store...';
            })
            .addCase(editstore.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.Store = state.Store.map((Stores) =>
                    Stores._id === action.payload._id ? action.payload : Stores
                );
                state.message = action.payload?.message || 'Store updated successfully';
            })
            .addCase(editstore.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update Store';
            });
    }
});

export default StoreSlice.reducer;