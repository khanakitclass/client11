import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { setAlert } from "./alert.slice";
import { BASE_URL } from "../../utils/baseURL";

const initialState = {
    categories: [],
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getCategories = createAsyncThunk(
    'categories/get',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(BASE_URL + '/allCategory');
            // console.log(response.data , "getCate");
            // console.log(response.data.category, " getCate");
            return response.data.category;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);


export const addCategories = createAsyncThunk(
    'categories/add',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(BASE_URL + '/addCategory', data);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return response.data.category;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deleteCategories = createAsyncThunk(
    'categories/delete',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(BASE_URL + `/deleteCategory/${id}`);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return id;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const editCategories = createAsyncThunk(
    'categories/edit',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const { _id, ...rest } = data;
            const response = await axiosInstance.put(BASE_URL + `/updateCategory/${_id}`, rest);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            console.log(response.data);
            return response.data.category;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get Categories
            .addCase(getCategories.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching categories...';
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                // console.log(action.payload);
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || 'Categories fetched successfully';
                state.categories = action.payload;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
            })
            // Add Category
            .addCase(addCategories.pending, (state) => {
                state.loading = true;
                state.message = 'Adding category...';
            })
            .addCase(addCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                if(Array.isArray(state.categories)) {
                    state.categories.push(action.payload);
                } else {
                    state.categories = [action.payload];
                }
                state.message = action.payload?.message || 'Category added successfully';
            })
            .addCase(addCategories.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to add category';
            })
            // Delete Category
            .addCase(deleteCategories.pending, (state) => {
                state.loading = true;
                state.message = 'Deleting category...';
            })
            .addCase(deleteCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.categories = state.categories.filter((v) => v._id !== action.payload);
                state.message = action.payload?.message || 'Category deleted successfully';
            })
            .addCase(deleteCategories.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete category';
            })
            // Edit Category
            .addCase(editCategories.pending, (state) => {
                state.loading = true;
                state.message = 'Editing category...';
            })
            .addCase(editCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.categories = state.categories.map((v) =>
                    v._id === action.payload._id ? action.payload : v
                );
                state.message = action.payload?.message || 'Category updated successfully';
            })
            .addCase(editCategories.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update category';
            });
    }
});

export default categoriesSlice.reducer;