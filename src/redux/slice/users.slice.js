import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/baseURL";
import { setAlert } from "./alert.slice";
import axiosInstance from "../../utils/axiosInstance";

const initialStateUsers = {
    users: [],
    currUser: null,
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getUsers = createAsyncThunk(
    'users/get',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(BASE_URL + '/allUsers');
            return response.data.user;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const addUser = createAsyncThunk(
    'users/add',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            console.log(data);

            const response = await axiosInstance.post(BASE_URL + '/createUser', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            console.log(response.data);
            return response.data.user;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deleteUser = createAsyncThunk(
    'users/delete',
    async (id, { dispatch, rejectWithValue }) => {
        console.log(id);
        try {
            const response = await axiosInstance.delete(`${BASE_URL}/deleteUser/${id}`);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return id;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const currentUser = createAsyncThunk(
    'users/currentUser',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/allUsers');
            console.log("responseresponseresponseresponse", response.data);
            return response.data.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const editUser = createAsyncThunk(
    'users/edit',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const { _id, ...rest } = data;
            console.log(rest, "data");
            const response = await axiosInstance.put(`${BASE_URL}/userUpdate/${_id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            console.log(response.data, "update data");
            return response.data.user;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);




const usersSlice = createSlice({
    name: 'users',
    initialState: initialStateUsers,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Users fetched successfully';
                state.users = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })
            .addCase(currentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.currUser = action.payload;
            })
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.message = 'Adding user...';
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.users.push(action.payload);
                state.message = action.payload?.message || 'User added successfully';
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to add user';
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.message = 'Deleting user...';
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.users = state.users.filter((user) => user._id !== action.payload);
                state.message = action.payload?.message || 'User deleted successfully';
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete user';
            })
            .addCase(editUser.pending, (state) => {
                state.loading = true;
                state.message = 'Editing user...';
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.users = state.users.map(user =>
                    user._id === action.payload._id ? action.payload : user
                );
                state.message = action.payload?.message || 'User updated successfully';
            })
            .addCase(editUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update user';
            });
    }
});

export default usersSlice.reducer;