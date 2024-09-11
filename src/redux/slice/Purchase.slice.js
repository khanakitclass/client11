import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../utils/baseURL";
import { setAlert } from "./alert.slice";
import axiosInstance from "../../utils/axiosInstance";

const initialStatePurchase = {
    purchase: [],
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getPurchase = createAsyncThunk(
    'Purchase/get',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(BASE_URL + '/getAllPurchase');
            return response.data.purchase;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const addPurchase = createAsyncThunk(
    'Purchase/add',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(BASE_URL + '/CreatePurchase', data.data);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return response.data.purchase;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deletePurchase = createAsyncThunk(
    'Purchase/delete',
    async (id, { dispatch, rejectWithValue }) => {
        // console.log(id);
        try {
            const response = await axiosInstance.delete(`${BASE_URL}/deletePurchase/${id}`);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return id;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const viewPurchase = createAsyncThunk(
    'Purchase/view',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/getPurchaseData/${id}`);
            return response.data.purchase;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const editPurchase = createAsyncThunk(
    'Purchase/edit',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const { _id, ...rest } = data;
            const response = await axiosInstance.put(`${BASE_URL}/updatePurchase/${_id}`, rest);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return response.data.purchase;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const purchaseSlice = createSlice({
    name: 'purchase',
    initialState: initialStatePurchase,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPurchase.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching Purchase...';
            })
            .addCase(getPurchase.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Purchase fetched successfully';
                state.purchase = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getPurchase.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch Purchase';
            })
            .addCase(addPurchase.pending, (state) => {
                state.loading = true;
                state.message = 'Adding Purchase...';
            })
            .addCase(addPurchase.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.purchase?.push(action.payload);
                state.message = action.payload?.message || 'Purchase added successfully';
            })
            .addCase(addPurchase.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to add Purchase';
            })
            .addCase(deletePurchase.pending, (state) => {
                state.loading = true;
                state.message = 'Deleting Purchase...';
            })
            .addCase(deletePurchase.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.users = state.purchase.filter((user) => user._id !== action.payload);
                state.message = action.payload?.message || 'Purchase deleted successfully';
            })
            .addCase(deletePurchase.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete Purchase';
            })
            .addCase(editPurchase.pending, (state) => {
                state.loading = true;
                state.message = 'Editing Purchase...';
            })
            .addCase(editPurchase.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                if (Array.isArray(state.purchase)) {
                    state.purchase = state.purchase.map(Purchase =>
                        Purchase._id === action.payload?._id ? action.payload : Purchase
                    );
                }
                state.message = 'Purchase updated successfully';
            })
            .addCase(editPurchase.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update Purchase';
            });
    }
});

export default purchaseSlice.reducer;