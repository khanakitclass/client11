import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { setAlert } from "./alert.slice";
import { BASE_URL } from "../../utils/baseURL";

const initialState = {
    Liasoning: [],
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getLiasoning = createAsyncThunk(
    'Liasoning/get',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(BASE_URL + '/getAllLiasoning');
            // console.log(response.data , "getCate");
            // console.log(response.data.liasoning, " getCate");
            return response.data.liasoning;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);


export const addLiasoning = createAsyncThunk(
    'Liasoning/add',
    async (data, { dispatch, rejectWithValue }) => {
        console.log(data);
        try {
            const response = await axiosInstance.post(BASE_URL + '/createLiasonig', data);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return response.data.liasoning;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deleteLiasoning = createAsyncThunk(
    'Liasoning/delete',
    async (id, { dispatch, rejectWithValue }) => {
        console.log(id);
        
        try {
            const response = await axiosInstance.delete(`${BASE_URL}/deleteLisoning/${id}`);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return id;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);
export const viewLiasoning = createAsyncThunk(
    'Liasoning/view',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/getLiasoning/${id}`);
            return response.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
)
export const editLiasoning = createAsyncThunk(
    'Liasoning/edit',
    async (data, { dispatch, rejectWithValue }) => {
        console.log(data, "update data")
        try {
            const { id, ...rest } = data;
            const response = await axiosInstance.put(BASE_URL + `/updateLiasoning/${id}`, rest);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            console.log(response.data);
            return response.data.liasoning;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const LiasoningSlice = createSlice({
    name: 'liasoning',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get Liasoning
            .addCase(getLiasoning.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching Liasoning...';
            })
            .addCase(getLiasoning.fulfilled, (state, action) => {
                // console.log(action.payload);
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || 'Liasoning fetched successfully';
                state.Liasoning = action.payload;
            })
            .addCase(getLiasoning.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
            })
            // Add Liasoning
            .addCase(addLiasoning.pending, (state) => {
                state.loading = true;
                state.message = 'Adding Liasoning...';
            })
            .addCase(addLiasoning.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                if (Array.isArray(state.Liasoning)) {
                    state.Liasoning.push(action.payload);
                } else {
                    state.Liasoning = [action.payload]
                }
                state.message = action.payload?.message || 'Liasoning added successfully';
            })
            .addCase(addLiasoning.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to add Liasoning';
            })
            // Delete Liasoning
            .addCase(deleteLiasoning.pending, (state) => {
                state.loading = true;
                state.message = 'Deleting Liasoning...';
            })
            .addCase(deleteLiasoning.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.Liasoning = state.Liasoning.filter((v) => v._id !== action.payload);
                state.message = action.payload?.message || 'Liasoning deleted successfully';
            })
            .addCase(deleteLiasoning.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete Liasoning';
            })
            // Edit Liasoning
            .addCase(editLiasoning.pending, (state) => {
                state.loading = true;
                state.message = 'Editing Liasoning...';
            })
            .addCase(editLiasoning.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.Liasoning = state.Liasoning.map((v) =>
                    v?._id === action.payload?._id ? action.payload : v
                );
                state.message = action.payload?.message || 'Liasoning updated successfully';
            })
            .addCase(editLiasoning.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update Liasoning';
            })
            //view single Liasoning
            .addCase(viewLiasoning.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching Residential Market...';
            })
            .addCase(viewLiasoning.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || 'Liasoing fetched successfully';
                state.Liasoning = Array.isArray(action.payload.data) ? action.payload.data : [];
            })
            .addCase(viewLiasoning.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch Liasoing';
            })
    }
});

export default LiasoningSlice.reducer;