import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/baseURL";
import { setAlert } from "./alert.slice";
import axiosInstance from "../../utils/axiosInstance";

const initialStatesideBar = {
    sidebar: [],
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getsidebar = createAsyncThunk(
    'sidebar/get',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(BASE_URL + '/AllSlideBarCategory');
            return response.data.sidebar;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const addsidebar = createAsyncThunk(
    'sidebar/add',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(BASE_URL + '/creatSlidebarCategory', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return response.data.sidebar;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deletesidebar = createAsyncThunk(
    'sidebar/delete',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`${BASE_URL}/deleteSlideBarCategory/${id}`);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return id;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const currentsidebar = createAsyncThunk(
    'sidebar/currentsidebar',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/AllSlideBarCategory');
            console.log("responseresponseresponseresponse", response.data);
            return response.data.sidebar;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const editsidebar = createAsyncThunk(
    'sidebar/edit',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const { _id, ...rest } = data;
            console.log(rest, "data");
            const response = await axiosInstance.put(`${BASE_URL}/updateSlideBarCategory/${_id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            console.log(response.data, "update data");
            return response.data.sidebar;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);




const sideBarSlice = createSlice({
    name: 'sidebar',
    initialState: initialStatesideBar,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getsidebar.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching sideBar...';
            })
            .addCase(getsidebar.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'sideBar fetched successfully';
                state.sidebar = action.payload; // Ensure this is the correct payload
            })
            .addCase(getsidebar.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch sideBar';
            })
            .addCase(currentsidebar.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.currsidebar = action.payload;
            })
            .addCase(addsidebar.pending, (state) => {
                state.loading = true;
                state.message = 'Adding sidebar...';
            })
            .addCase(addsidebar.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.sidebar.push(action.payload);
                state.message = action.payload?.message || 'sidebar added successfully';
            })
            .addCase(addsidebar.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to add sidebar';
            })
            .addCase(deletesidebar.pending, (state) => {
                state.loading = true;
                state.message = 'Deleting sidebar...';
            })
            .addCase(deletesidebar.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.sidebar = state.sidebar.filter((sidebar) => sidebar._id !== action.payload);
                state.message = action.payload?.message || 'sidebar deleted successfully';
            })
            .addCase(deletesidebar.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete sidebar';
            })
            .addCase(editsidebar.pending, (state) => {
                state.loading = true;
                state.message = 'Editing sidebar...';
            })
            .addCase(editsidebar.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.sidebar = state.sidebar.map(sidebar =>
                    sidebar?._id === action.payload?._id ? action.payload : sidebar
                );
                state.message = action.payload?.message || 'sidebar updated successfully';
            })
            .addCase(editsidebar.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update sidebar';
            });
    }
});

export default sideBarSlice.reducer;