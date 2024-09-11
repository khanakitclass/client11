import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { setAlert } from "./alert.slice";
import { BASE_URL } from "../../utils/baseURL";

const initialState = {
    Residential: [],
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getRasidentialMarketing = createAsyncThunk(
    'rasidentialMarketing/get',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(BASE_URL + '/getAllresidentMarket');
            // console.log(response.data, "getcommercialMarketing");
            return response.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const addRasidentialMarketing = createAsyncThunk(
    'rasidentialMarketing/add',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            console.log("data>>>>>>>>>>>>>", data);
            const response = await axiosInstance.post(BASE_URL + '/createResidentMarket', data);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            console.log(response.data.commercialMarket, "addcommercialMarketing");
            return response.data.commercialMarket;

        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deleteRasidentialMarketing = createAsyncThunk(
    'rasidentialMarketing/delete',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(BASE_URL + `/deleteResidenMarket/${id}`);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            dispatch(getRasidentialMarketing());
            return id;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);
export const viewRasidentialMarketing = createAsyncThunk(
    'rasidentialMarketing/view',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/getResidentMarket/${id}`);
            // console.log("response>>>>>",response.data.commercialMarket);
            return response.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const editRasidentialMarketing = createAsyncThunk(
    'rasidentialMarketing/edit',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const { id, ...rest } = data;
            console.log("id>>>>>>>", id);
            console.log("data>>>>>>>", data);
            const response = await axiosInstance.put(`${BASE_URL}/updateResidentMarket/${id}`, rest);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            console.log(response.data);
            return response.data.commercialMarket;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const ResidenialMarketingSlice = createSlice({
    name: 'residenialMarketing',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get Residential Market
            .addCase(getRasidentialMarketing.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching Residential Marketing...';
            })
            .addCase(getRasidentialMarketing.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || 'Residential Marketing fetched successfully';
                state.Residential = action.payload;
            })
            .addCase(getRasidentialMarketing.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
            })
            // Add Residential Market
            .addCase(addRasidentialMarketing.pending, (state) => {
                state.loading = true;
                state.message = 'Adding Residential...';
            })
            .addCase(addRasidentialMarketing.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                if(Array.isArray(state.Residential)) {
                    state.Residential.push(action.payload);
                } else {
                    state.Residential = [action.payload]
                }
                state.message = action.payload?.message || 'Residential Marketing added successfully';
            })
            .addCase(addRasidentialMarketing.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to add Residential Marketing';
            })
            // Delete Residential Market
            .addCase(deleteRasidentialMarketing.pending, (state) => {
                state.loading = true;
                state.message = 'Deleting Residential Marketing...';
            })
            .addCase(deleteRasidentialMarketing.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                if (Array.isArray(state.Residential)) {
                    state.Residential = state.Residential.filter((v) => v._id !== action.payload);
                }
                state.message = action.payload?.message || 'Residential Marketing deleted successfully';
            })
            .addCase(deleteRasidentialMarketing.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete Residential Marketing';
            })
            // Edit Residential Market
            .addCase(editRasidentialMarketing.pending, (state) => {
                state.loading = true;
                state.message = 'Editing Residential Marketing...';
            })
            .addCase(editRasidentialMarketing.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                if(Array.isArray(state.Residential)) {
                    state.Residential = state.Residential.map((v) =>
                        v._id === action.payload._id ? action.payload : v
                    );
                }
                state.message = action.payload?.message || 'Residential Marketing updated successfully';
            })
            .addCase(editRasidentialMarketing.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update Residential Marketing';
            })
            //view single Residential Market 
            .addCase(viewRasidentialMarketing.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching Residential Market...';
            })
            .addCase(viewRasidentialMarketing.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || 'Residential Market fetched successfully';
                state.Residential = Array.isArray(action.payload.data) ? action.payload.data : [];
            })
            .addCase(viewRasidentialMarketing.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch Residential Market';
            })
    }
});

export default ResidenialMarketingSlice.reducer;