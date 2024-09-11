import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/baseURL";
import { setAlert } from "./alert.slice";

const initialState = {
    Terms: [],
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getTerms = createAsyncThunk(
    'Terms/get',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.get(BASE_URL + '/allTermsAndConditions');
            // console.log(response.data);
            return response.data.termsAndCondition;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const addTerms = createAsyncThunk(
    'Terms/add',
    async (data, { dispatch, rejectWithValue }) => {
        // console.log(data);
        try {
            const response = await axios.post(BASE_URL + '/createTermsAndCondition', data);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            // console.log(response.data);
            return response.data.termsAndCondition;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deleteTerms = createAsyncThunk(
    'Terms/delete',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.delete(`${BASE_URL}/deleteTermsAndCondition/${id}`);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return id;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const editTerms = createAsyncThunk(
    'Terms/edit',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const { _id, ...rest } = data;
            // console.log(data);
            const response = await axios.put(`${BASE_URL}/updateTermsAndCondition/${_id}`, rest);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            // console.log(response.data);
            return response.data.termsAndCondition;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const TermsSlice = createSlice({
    name: 'Terms',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTerms.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching Terms...';
            })
            .addCase(getTerms.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || 'Terms fetched successfully';
                state.Terms = action.payload;
            })
            .addCase(getTerms.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch Terms';
            })
            .addCase(addTerms.pending, (state) => {
                state.loading = true;
                state.message = 'Adding Terms...';
            })
            .addCase(addTerms.fulfilled, (state, action) => {
                // console.log(action.payload);
                state.loading = false;
                state.success = true;
                state.Terms?.push(action.payload);
                state.message = action.payload?.message || 'Terms added successfully';
            })
            .addCase(addTerms.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to add Terms';
            })
            .addCase(deleteTerms.pending, (state) => {
                state.loading = true;
                state.message = 'Deleting Terms...';
            })
            .addCase(deleteTerms.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.Terms = state.Terms.filter((Term) => Term._id !== action.payload);
                state.message = action.payload?.message || 'Terms deleted successfully';
            })
            .addCase(deleteTerms.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete Terms';
            })
            .addCase(editTerms.pending, (state) => {
                state.loading = true;
                state.message = 'Editing Terms...';
            })
            .addCase(editTerms.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.Terms = state.Terms.map((Term) =>
                    Term._id === action.payload._id ? action.payload : Term
                );
                state.message = action.payload?.message || 'Terms updated successfully';
            })
            .addCase(editTerms.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update Terms';
            });
    }
});

export default TermsSlice.reducer;