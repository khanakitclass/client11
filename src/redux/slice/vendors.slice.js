import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../utils/baseURL";
import { setAlert } from "./alert.slice";
import axiosInstance from "../../utils/axiosInstance";

const initialState = {
    vendors: [],
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getVendors = createAsyncThunk(
    'vendors/get',
    async (_, { dispatch, rejectWithValue }) => {
        try {

            const response = await axiosInstance.get(BASE_URL + '/getAllVender');
            // console.log(response.data);
            return response.data.vendor;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const addVendor = createAsyncThunk(
    'vendors/add',
    async ({ data, navigate }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(BASE_URL + '/createVandore', data);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            // console.log(response.data);
            navigate('/admin/vendors');
            return response.data.vendor;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deleteVendor = createAsyncThunk(
    'vendors/delete',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`${BASE_URL}/deleteVendor/${id}`);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return id;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const viewVendor = createAsyncThunk(
    'vendors/view',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/getVenderbyId/${id}`);
            return response.data.vendor;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);
export const editVendor = createAsyncThunk(
    'vendors/edit',
    async (data, { dispatch, rejectWithValue }) => {
        console.log(data);

        try {
            const { _id, navigate, ...rest } = data;


            const response = await axiosInstance.put(`${BASE_URL}/updateVenode/${_id}`, data);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            navigate('/admin/vendors');
            console.log(response.data);

            return response.data.vendor;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const vendorsSlice = createSlice({
    name: 'vendors',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getVendors.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching vendors...';
            })
            .addCase(getVendors.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Vendors fetched successfully';
                state.vendors = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getVendors.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch vendors';
            })
            // Add Vendor
            .addCase(addVendor.pending, (state) => {
                state.loading = true;
                state.message = 'Adding vendor...';
            })
            .addCase(addVendor.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.vendors.push(action.payload);
                state.message = action.payload?.message || 'Vendor added successfully';
            })
            .addCase(addVendor.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to add vendor';
            })
            // Delete Vendor
            .addCase(deleteVendor.pending, (state) => {
                state.loading = true;
                state.message = 'Deleting vendor...';
            })
            .addCase(deleteVendor.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.vendors = state.vendors.filter((vendor) => vendor._id !== action.payload);
                state.message = action.payload?.message || 'Vendor deleted successfully';
            })
            .addCase(deleteVendor.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete vendor';
            })
            // Edit Vendor
            .addCase(editVendor.pending, (state) => {
                state.loading = true;
                state.message = 'Editing vendor...';
            })
            .addCase(editVendor.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.vendors = state.vendors.map((vendor) =>
                    vendor._id === action.payload._id ? action.payload : vendor
                );
                state.message = action.payload?.message || 'Vendor updated successfully';
            })
            .addCase(editVendor.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update vendor';
            });
    },
});

export default vendorsSlice.reducer;
