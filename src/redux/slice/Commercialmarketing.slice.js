import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { setAlert } from "./alert.slice";
import { BASE_URL } from "../../utils/baseURL";

const initialState = {
    Marketing: [],
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getCommercialMarketing = createAsyncThunk(
    'commercialMarketing/get',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(BASE_URL + '/getAllCommercialMarket');
            // console.log(response.data, "getcommercialMarketing");
            return response.data.commercialMarket;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const addCommercialMarketing = createAsyncThunk(
    'commercialMarketing/add',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(BASE_URL + '/createCommercialMarket', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return response.data.commercialMarket;
        } catch (error) {
            console.log("Error occurred:", error);
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deleteCommercialMarketing = createAsyncThunk(
    'commercialMarketing/delete',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(BASE_URL + `/deleteCommercial/${id}`);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return id;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);
export const viewComerialMarketing = createAsyncThunk(
    'commercialMarketing/view',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/getCommercialMarket/${id}`);
            // console.log("response>>>>>",response.data.CommercialMarket);
            return response.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const editCommercialMarketing = createAsyncThunk(
    'commercialMarketing/edit',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const { id, ...rest } = data;
            // console.log("id>>>>>>>", id);
            // console.log("data>>>>>>>", data);
            const response = await axiosInstance.put(`${BASE_URL}/updateCommercial/${id}`, rest, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });

            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            console.log(response.data);
            return response.data.commercialMarket;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const CommercialMarketingSlice = createSlice({
    name: 'commercialMarketing',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get commercial Market
            .addCase(getCommercialMarketing.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching Commercial Marketing...';
            })
            .addCase(getCommercialMarketing.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || 'Commercial Marketing fetched successfully';
                state.Marketing = action.payload;
            })
            .addCase(getCommercialMarketing.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
            })
            // Add commercial Market
            .addCase(addCommercialMarketing.pending, (state) => {
                state.loading = true;
                state.message = 'Adding category...';
            })
            .addCase(addCommercialMarketing.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.Marketing.push(action.payload);
                state.message = action.payload?.message || 'Commercial Marketing added successfully';
            })
            .addCase(addCommercialMarketing.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to add Commercial Marketing';
            })
            // Delete commercial Market
            .addCase(deleteCommercialMarketing.pending, (state) => {
                state.loading = true;
                state.message = 'Deleting Commercial Marketing...';
            })
            .addCase(deleteCommercialMarketing.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.Marketing = state.Marketing.filter((v) => v._id !== action.payload);
                state.message = action.payload?.message || 'Commercial Marketing deleted successfully';
            })
            .addCase(deleteCommercialMarketing.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete Commercial Marketing';
            })
            // Edit commercial Market
            .addCase(editCommercialMarketing.pending, (state) => {
                state.loading = true;
                state.message = 'Editing Commercial Marketing...';
            })
            .addCase(editCommercialMarketing.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                if (Array.isArray(state.Marketing)) {
                    state.Marketing = state.Marketing.map((v) =>
                        v?._id === action.payload?._id ? action.payload : v
                    );
                }
                state.message = action.payload?.message || 'Commercial Marketing updated successfully';
            })
            .addCase(editCommercialMarketing.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update Commercial Marketing';
            })
            //view single commercial Market 
            .addCase(viewComerialMarketing.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching Commercial Market...';
            })
            .addCase(viewComerialMarketing.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || 'commercial Market fetched successfully';
                state.Marketing = Array.isArray(action.payload.data) ? action.payload.data : [];
            })
            .addCase(viewComerialMarketing.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch commercial Market';
            })
    }
});

export default CommercialMarketingSlice.reducer;