// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
// import axios from "axios";
// import { BASE_URL } from "../../utils/baseURL";


// const initialState = {
//     subcategories: [],
//     success: false,
//     message: '',
//     loading: false,
// }

// export const getSubcategories = createAsyncThunk(
//     'subcategories/get',
//     async () => {
//         try {
//             const response = await axios.get(BASE_URL + 'subcategories/list-subcategory');
//             return response.data;
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     }
// );

// export const getSubcategoriesByCategory = createAsyncThunk(
//     'getSubcategoriesByCategory/get',
//     async (id, { rejectWithValue }) => {
//         try {
//             const response = await axios.get(BASE_URL + 'subcategories/get-subcategory-bycategory/' + id);

//             console.log(response.data);

//             return response.data;
//         } catch (error) {
//             return rejectWithValue({
//                 message: error.response?.data?.message || 'Failed to fetch subcategories',
//                 data: error.response?.data.data
//             });
//         }
//     }
// );

// export const addSubcategories = createAsyncThunk(
//     'subcategories/add',
//     async (data) => {

//         try {
//             console.log(data);
//             const response = await axios.post(BASE_URL + 'subcategories/add-subcategory', data);
//             return response.data;
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     }
// );

// export const deleteSubcategories = createAsyncThunk(
//     'subcategories/delete',
//     async (id) => {
//         try {
//             await axios.delete(`${BASE_URL}subcategories/delete-subcategory/${id}`);
//             return id;
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     }
// );

// export const editSubcategories = createAsyncThunk(
//     'subcategories/edit',
//     async (data) => {
//         try {
//             const {_id, ...rest} = data;
//             const response = await axios.put(`${BASE_URL}subcategories/update-subcategory/${_id}`, rest);
//             return response.data;
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     }
// )

// const subcategoriesSlice = createSlice({
//     name: 'subcategories',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(getSubcategories.pending, (state) => {
//                 state.loading = true;
//                 state.message = 'Fetching subcategories...';
//             })
//             .addCase(getSubcategories.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.success = true;
//                 state.message = action.payload.message || 'Subcategories fetched successfully';
//                 state.subcategories = action.payload.data;
//             })
//             .addCase(getSubcategories.rejected, (state, action) => {
//                 state.loading = false;
//                 state.success = false;
//                 state.message = action.error.message || 'Failed to fetch subcategories';
//             })
//             .addCase(getSubcategoriesByCategory.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.success = true;
//                 state.message = action.payload.message || 'Subcategories fetched successfully';
//                 state.subcategories = action.payload.data;
//             })
//             .addCase(getSubcategoriesByCategory.rejected, (state, action) => {
//                 state.loading = false;
//                 state.success = false;
//                 state.message = action.payload.message || 'Failed to fetch subcategories';
//                 state.subcategories = action.payload.data;
//             })
//             .addCase(addSubcategories.fulfilled, (state, action) => {
//                 state.subcategories = state.subcategories.concat(action.payload.data);
//                 state.message = 'Category added successfully';
//             })
//             .addCase(addSubcategories.rejected, (state, action) => {
//                 state.message = action.error.message || 'Failed to add category';
//             })
//             .addCase(deleteSubcategories.fulfilled, (state, action) => {
//                 state.subcategories = state.subcategories.filter((v) => v._id !== action.payload);
//                 state.message = 'Category deleted successfully';
//             })
//             .addCase(deleteSubcategories.rejected, (state, action) => {
//                 state.message = action.error.message || 'Failed to delete category';
//             })
//             .addCase(editSubcategories.fulfilled, (state, action) => {
//                 console.log(action.payload);
//                 state.subcategories = state.subcategories.map((v) => 
//                     v._id === action.payload.data._id ? action.payload.data : v
//                 );
//                 state.message = 'Category updated successfully';
//             })
//             .addCase(editSubcategories.rejected, (state, action) => {
//                 state.message = action.error.message || 'Failed to update category';
//             });
//     }
// })

// export default subcategoriesSlice.reducekr;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../utils/baseURL";
import { setAlert } from "./alert.slice";
import axiosInstance from "../../utils/axiosInstance";

const initialState = {
    subcategories: [],
    success: false,
    message: '',
    loading: false,
    error: null,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getSubcategories = createAsyncThunk(
    'subcategories/get',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(BASE_URL + '/allSubCategory');
            // console.log(response.data.subCategories);
            return response.data.subCategories;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const getSubcategoriesByCategory = createAsyncThunk(
    'getSubcategoriesByCategory/get',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(BASE_URL + '/getSubCategory/' + id);
            return response.data.subCategories;
        } catch (error) {
            return handleErrors( dispatch);
        }
    }
);

export const addSubcategories = createAsyncThunk(
    'subcategories/add',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(BASE_URL + '/addSubCategory', data);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return response.data.subCategories;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deleteSubcategories = createAsyncThunk(
    'subcategories/delete',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`${BASE_URL}/deleteSubCategory/${id}`);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return id;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const editSubcategories = createAsyncThunk(
    'subcategories/edit',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const { _id, ...rest } = data;
            const response = await axiosInstance.put(`${BASE_URL}/updateSubCategory/${_id}`, rest);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return response.data.subCategories;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const subcategoriesSlice = createSlice({
    name: 'subcategories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSubcategories.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching subcategories...';
            })
            .addCase(getSubcategories.fulfilled, (state, action) => {
                // console.log(action.payload);
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || 'Subcategories fetched successfully';
                state.subcategories = action.payload;
            })
            .addCase(getSubcategories.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch subcategories';
            })
            .addCase(getSubcategoriesByCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || 'Subcategories fetched successfully';
                state.subcategories = action.payload;
            })
            .addCase(getSubcategoriesByCategory.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch subcategories';
            })
            .addCase(addSubcategories.fulfilled, (state, action) => {
                state.subcategories = state.subcategories.concat(action.payload);
                state.message = 'Subcategory added successfully';
            })
            .addCase(addSubcategories.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to add subcategory';
            })
            .addCase(deleteSubcategories.fulfilled, (state, action) => {
                state.subcategories = state.subcategories.filter((v) => v._id !== action.payload);
                state.message = 'Subcategory deleted successfully';
            })
            .addCase(deleteSubcategories.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to delete subcategory';
            })
            .addCase(editSubcategories.fulfilled, (state, action) => {
                state.subcategories = state.subcategories.map((v) =>
                    v._id === action.payload._id ? action.payload : v
                );
                state.message = 'Subcategory updated successfully';
            })
            .addCase(editSubcategories.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to update subcategory';
            });
    }
});

export default subcategoriesSlice.reducer;
