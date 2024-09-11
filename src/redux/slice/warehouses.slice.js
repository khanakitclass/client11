// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import { BASE_URL } from "../../utils/baseURL";

// const initialState = {
//     warehouses: [],
//     success: false,
//     message: '',
//     loading: false,
// };

// export const getWarehouses = createAsyncThunk(
//     'warehouses/get',
//     async () => {
//         try {
//             const response = await axios.get(BASE_URL + 'warehouses/list-warehouses'); // Adjust endpoint as per your backend API
//             return response.data;
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     }
// );

// export const addWarehouse = createAsyncThunk(
//     'warehouses/add',
//     async (data) => {
//         try {
//             const response = await axios.post(BASE_URL + 'warehouses/add-warehouse', data); // Adjust endpoint as per your backend API
//             return response.data;
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     }
// );

// export const deleteWarehouse = createAsyncThunk(
//     'warehouses/delete',
//     async (id) => {
//         try {
//             await axios.delete(`${BASE_URL}warehouses/delete-warehouse/${id}`); // Adjust endpoint as per your backend API
//             return id;
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     }
// );

// export const editWarehouse = createAsyncThunk(
//     'warehouses/edit',
//     async (data) => {
//         try {
//             const { _id, ...rest } = data;
//             const response = await axios.put(`${BASE_URL}warehouses/update-warehouse/${_id}`, rest); // Adjust endpoint as per your backend API
//             return response.data;
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     }
// );

// const warehousesSlice = createSlice({
//     name: 'warehouses',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(getWarehouses.pending, (state) => {
//                 state.loading = true;
//                 state.message = 'Fetching warehouses...';
//             })
//             .addCase(getWarehouses.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.success = true;
//                 state.message = action.payload.message || 'Warehouses fetched successfully';
//                 state.warehouses = action.payload.data;
//             })
//             .addCase(getWarehouses.rejected, (state, action) => {
//                 state.loading = false;
//                 state.success = false;
//                 state.message = action.error.message || 'Failed to fetch warehouses';
//             })
//             .addCase(addWarehouse.fulfilled, (state, action) => {
//                 state.warehouses = state.warehouses.concat(action.payload.data);
//                 state.message = 'Warehouse added successfully';
//             })
//             .addCase(addWarehouse.rejected, (state, action) => {
//                 state.message = action.error.message || 'Failed to add warehouse';
//             })
//             .addCase(deleteWarehouse.fulfilled, (state, action) => {
//                 state.warehouses = state.warehouses.filter((warehouse) => warehouse._id !== action.payload);
//                 state.message = 'Warehouse deleted successfully';
//             })
//             .addCase(deleteWarehouse.rejected, (state, action) => {
//                 state.message = action.error.message || 'Failed to delete warehouse';
//             })
//             .addCase(editWarehouse.fulfilled, (state, action) => {
//                 state.warehouses = state.warehouses.map((warehouse) =>
//                     warehouse._id === action.payload.data._id ? action.payload.data : warehouse
//                 );
//                 state.message = 'Warehouse updated successfully';
//             })
//             .addCase(editWarehouse.rejected, (state, action) => {
//                 state.message = action.error.message || 'Failed to update warehouse';
//             });
//     },
// });

// export default warehousesSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../utils/baseURL";
import { setAlert } from "./alert.slice";
import axiosInstance from "../../utils/axiosInstance";

const initialState = {
    warehouses: [],
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getWarehouses = createAsyncThunk(
    'warehouses/get',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(BASE_URL + '/getAllWarehouse');
            return response.data.wareHouse;
        } catch (error) {
            return rejectWithValue();
        }
    }
);

export const addWarehouse = createAsyncThunk(
    'warehouses/add',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(BASE_URL + '/createWarehouse', data);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return response.data.wareHouse;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deleteWarehouse = createAsyncThunk(
    'warehouses/delete',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`${BASE_URL}/deleteWarehouse/${id}`);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return id;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);
export const viewWerehouse = createAsyncThunk(
    'warehouses/view',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/geWareHouseById/${id}`);
            return response.data.wareHouse;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const editWarehouse = createAsyncThunk(
    'warehouses/edit',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const { _id, ...rest } = data;
            const response = await axiosInstance.put(`${BASE_URL}/updateWareHouse/${_id}`, rest);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return response.data.wareHouse;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const warehousesSlice = createSlice({
    name: 'warehouses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getWarehouses.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching warehouses...';
            })
            .addCase(getWarehouses.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Warehouses fetched successfully';
                state.warehouses = action.payload;
            })
            .addCase(getWarehouses.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
            })
            // Add Warehouse
            .addCase(addWarehouse.pending, (state) => {
                state.loading = true;
                state.message = 'Adding warehouse...';
            })
            .addCase(addWarehouse.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                if(Array.isArray(state.warehouses)) {
                    state.warehouses.push(action.payload);
                } else {
                    state.warehouses = [action.payload];
                }
                state.message = action.payload?.message || 'Warehouse added successfully';
            })
            .addCase(addWarehouse.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to add warehouse';
            })
            // Delete Warehouse
            .addCase(deleteWarehouse.pending, (state) => {
                state.loading = true;
                state.message = 'Deleting warehouse...';
            })
            .addCase(deleteWarehouse.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.warehouses = state.warehouses.filter((warehouse) => warehouse._id !== action.payload);
                state.message = action.payload?.message || 'Warehouse deleted successfully';
            })
            .addCase(deleteWarehouse.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete warehouse';
            })
            // Edit Warehouse
            .addCase(editWarehouse.pending, (state) => {
                state.loading = true;
                state.message = 'Editing warehouse...';
            })
            .addCase(editWarehouse.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.warehouses = state.warehouses.map(warehouse =>
                    warehouse._id === action.payload._id ? action.payload : warehouse
                );
                state.message = action.payload?.message || 'Warehouse updated successfully';
            })
            .addCase(editWarehouse.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update warehouse';
            });
    },
});

export default warehousesSlice.reducer;
