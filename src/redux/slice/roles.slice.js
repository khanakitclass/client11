import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/baseURL";
import { setAlert } from "./alert.slice";

const initialState = {
    roles: [],
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getRoles = createAsyncThunk(
    'roles/get',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.get(BASE_URL + '/allRoles');
            // console.log(response.data.role);
            return response.data.role;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const addRole = createAsyncThunk(
    'roles/add',
    async (data, { dispatch, rejectWithValue }) => {
        // console.log(data);
        try {
            const response = await axios.post(BASE_URL + '/createRole', data);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            // console.log(response.data);
            return response.data.role;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deleteRole = createAsyncThunk(
    'roles/delete',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.delete(`${BASE_URL}/deleteRole/${id}`);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return id;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const editRole = createAsyncThunk(
    'roles/edit',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const { _id, ...rest } = data;
            // console.log(data);
            const response = await axios.put(`${BASE_URL}/updateRole/${_id}`, rest);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            // console.log(response.data);
            return response.data.role;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRoles.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching roles...';
            })
            .addCase(getRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || 'Roles fetched successfully';
                state.roles = action.payload;
            })
            .addCase(getRoles.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch roles';
            })
            .addCase(addRole.pending, (state) => {
                state.loading = true;
                state.message = 'Adding role...';
            })
            .addCase(addRole.fulfilled, (state, action) => {
                // console.log(action.payload);
                state.loading = false;
                state.success = true;
                state.roles.push(action.payload);
                state.message = action.payload?.message || 'Role added successfully';
            })
            .addCase(addRole.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to add role';
            })
            .addCase(deleteRole.pending, (state) => {
                state.loading = true;
                state.message = 'Deleting role...';
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.roles = state.roles.filter((role) => role._id !== action.payload);
                state.message = action.payload?.message || 'Role deleted successfully';
            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete role';
            })
            .addCase(editRole.pending, (state) => {
                state.loading = true;
                state.message = 'Editing role...';
            })
            .addCase(editRole.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.roles = state.roles.map((role) =>
                    role._id === action.payload._id ? action.payload : role
                );
                state.message = action.payload?.message || 'Role updated successfully';
            })
            .addCase(editRole.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update role';
            });
    }
});

export default rolesSlice.reducer;