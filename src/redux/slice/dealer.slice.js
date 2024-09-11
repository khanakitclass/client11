import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../utils/baseURL";
import { setAlert } from "./alert.slice";
import axiosInstance from "../../utils/axiosInstance";

const initialStateDealer = {
    Dealer: [],
    // currUser: null,
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getDealers = createAsyncThunk(
    'dealer/get',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(BASE_URL + '/getAllDealer');

            return response.data.Dealer;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const addDelear = createAsyncThunk(
    'dealer/add',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            // console.log(data);

            const response = await axiosInstance.post(BASE_URL + '/createDealer', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            // console.log(response.data);
            return response.data.Dealer;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deleteDealer = createAsyncThunk(
    'dealer/delete',
    async (id, { dispatch, rejectWithValue }) => {
        // console.log(id);
        try {
            const response = await axiosInstance.delete(`${BASE_URL}/deleteDealer/${id}`);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            dispatch(getDealers());
            return id;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const viewDealer = createAsyncThunk(
    'dealer/view',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/getDealerById/${id}`);
            return response.data.Dealer;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const editDealer = createAsyncThunk(
    'dealer/edit',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const { _id, ...rest } = data;
            // console.log(data, "data");
            const response = await axiosInstance.put(`${BASE_URL}/updateDealer/${_id}`, rest, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return response.data.Dealer;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const dealerSlice = createSlice({
    name: 'dealer',
    initialState: initialStateDealer,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDealers.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching Dealers...';
            })
            .addCase(getDealers.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Dealers fetched successfully';
                state.Dealer = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getDealers.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch dealers';
            })
            .addCase(addDelear.pending, (state) => {
                state.loading = true;
                state.message = 'Adding dealer...';
            })
            .addCase(addDelear.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.Dealer.push(action.payload);
                state.message = action.payload?.message || 'Dealer added successfully';
            })
            .addCase(addDelear.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to add dealer';
            })
            .addCase(deleteDealer.pending, (state) => {
                state.loading = true;
                state.message = 'Deleting dealer...';
            })
            .addCase(deleteDealer.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.users = state.Dealer.filter((user) => user._id !== action.payload);
                state.message = action.payload?.message || 'Dealer deleted successfully';
            })
            .addCase(deleteDealer.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete dealer';
            })
            .addCase(editDealer.pending, (state) => {
                state.loading = true;
                state.message = 'Editing dealer...';
            })
            .addCase(editDealer.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                if (Array.isArray(state.Dealer)) {
                    state.Dealer = state.Dealer.map(dealer =>
                        dealer._id === action.payload?._id ? action.payload : dealer
                    );
                }
                state.message = 'Dealer updated successfully';
                // console.log("Fulfilled editDealer:", state.DealerRegister);
            })
            .addCase(editDealer.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update dealer';
            });
    }
});

export default dealerSlice.reducer;