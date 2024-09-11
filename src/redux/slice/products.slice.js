// // import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
// // import axios from "axios";
// // import { BASE_URL } from "../../utils/baseURL";
// // import { setAlert } from "./alert.slice";


// // const initialState = {
// //     products: [],
// //     success: false,
// //     message: '',
// //     loading: false,
// // }

// // export const getProducts = createAsyncThunk(
// //     'products/get',
// //     async (data, { dispatch }) => {
// //         try {
// //             const response = await axios.get(BASE_URL + 'products/list-products');
// //             return response.data;
// //         } catch (error) {
// //             dispatch(setAlert({ text: error.message, color: 'error' }));
// //         }
// //     }
// // );

// // export const addProduct = createAsyncThunk(
// //     'products/add',
// //     async (data, { dispatch, rejectWithValue  }) => {
// //         try {
// //             const response = await axios.post(BASE_URL + 'products/add-product', data);
// //             dispatch(setAlert({ text: response.data.message, color: 'success' }));
// //             return response.data;
// //         } catch (error) {
// //             dispatch(setAlert({ text: error.message, color: 'error' }));
// //             return rejectWithValue(error.message);
// //         }
// //     }
// // );

// // export const deleteProduct = createAsyncThunk(
// //     'products/delete',
// //     async (id, { dispatch }) => {
// //         try {
// //             await axios.delete(`${BASE_URL}products/delete-product/${id}`);
// //             return id;
// //         } catch (error) {
// //             dispatch(setAlert({ text: error.message, color: 'error' }));
// //         }
// //     }
// // );

// // export const editProduct = createAsyncThunk(
// //     'products/edit',
// //     async (data, { dispatch, rejectWithValue }) => {
// //         try {
// //             const { _id, ...rest } = data;
// //             const response = await axios.put(`${BASE_URL}products/update-product/${_id}`, rest);
// //             return response.data;
// //         } catch (error) {
// //             dispatch(setAlert({ text: error.message, color: 'error' }));
// //             throw new Error(error.message)
// //         }
// //     }
// // )

// // const onLoading = (state, action) => {
// //     state.isLoading = true;
// //     state.error = null;
// // }

// // const onError = (state, action) => {
// //     console.log(action);
// //     state.isLoading = false;
// //     state.error = action.error.message;
// // }

// // const productsSlice = createSlice({
// //     name: 'products',
// //     initialState,
// //     reducers: {},
// //     extraReducers: (builder) => {
// //         builder
// //             .addCase(getProducts.pending, (state) => {
// //                 state.loading = true;
// //                 state.message = 'Fetching products...';
// //             })
// //             .addCase(getProducts.fulfilled, (state, action) => {
// //                 state.loading = false;
// //                 state.success = true;
// //                 state.message = action.payload.message || 'Products fetched successfully';
// //                 state.products = action.payload.data;
// //             })
// //             .addCase(getProducts.rejected, (state, action) => {
// //                 state.loading = false;
// //                 state.success = false;
// //                 state.message = action.error.message || 'Failed to fetch products';
// //             })
// //             .addCase(addProduct.pending, onLoading)
// //             .addCase(addProduct.fulfilled, (state, action) => {
// //                 state.products = state.products.concat(action.payload.data);
// //                 state.message = 'Product added successfully';
// //             })
// //             .addCase(addProduct.rejected, onError)
// //             .addCase(deleteProduct.fulfilled, (state, action) => {
// //                 state.products = state.products.filter((v) => v._id !== action.payload);
// //                 state.message = 'Product deleted successfully';
// //             })
// //             .addCase(deleteProduct.rejected, (state, action) => {
// //                 state.message = action.error.message || 'Failed to delete product';
// //             })
// //             .addCase(editProduct.fulfilled, (state, action) => {
// //                 console.log(action.payload);
// //                 state.products = state.products.map((v) => 
// //                     v._id === action.payload.data._id ? action.payload.data : v
// //                 );
// //                 state.message = 'Product updated successfully';
// //             })
// //             .addCase(editProduct.rejected, (state, action) => {
// //                 state.message = action.error.message || 'Failed to update product';
// //             });
// //     }
// // })

// // export default productsSlice.reducer;

// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
// import axios from "axios";
// import { BASE_URL } from "../../utils/baseURL";
// import { setAlert } from "./alert.slice";

// const initialState = {
//     products: [],
//     success: false,
//     message: '',
//     loading: false,
//     error: null,
// }

// export const getProducts = createAsyncThunk(
//     'products/get',
//     async (_, { dispatch, rejectWithValue }) => {
//         try {
//             const response = await axios.get(BASE_URL + 'products/list-products');
//             return response.data;
//         } catch (error) {
//             dispatch(setAlert({ text: error.message, color: 'error' }));
//             return rejectWithValue(error.message);
//         }
//     }
// );

// export const getDetailsProducts = createAsyncThunk(
//     'products/getDetailsProducts',
//     async (_, { dispatch, rejectWithValue }) => {
//         try {
//             const response = await axios.get(BASE_URL + 'products/all-products');
//             return response.data;
//         } catch (error) {
//             dispatch(setAlert({ text: error.message, color: 'error' }));
//             return rejectWithValue(error.message);
//         }
//     }
// );

// export const addProduct = createAsyncThunk(
//     'products/add',
//     async (data, { dispatch, rejectWithValue  }) => {
//         try {
//             const response = await axios.post(BASE_URL + 'products/add-product', data);
//             dispatch(setAlert({ text: response.data.message, color: 'success' }));
//             return response.data;
//         } catch (error) {
//             dispatch(setAlert({ text: error.message, color: 'error' }));
//             return rejectWithValue(error.message);
//         }
//     }
// );

// export const deleteProduct = createAsyncThunk(
//     'products/delete',
//     async (id, { dispatch, rejectWithValue }) => {
//         try {
//             await axios.delete(`${BASE_URL}products/delete-product/${id}`);
//             return id;
//         } catch (error) {
//             dispatch(setAlert({ text: error.message, color: 'error' }));
//             return rejectWithValue(error.message);
//         }
//     }
// );

// export const editProduct = createAsyncThunk(
//     'products/edit',
//     async (data, { dispatch, rejectWithValue }) => {
//         try {
//             const { _id, ...rest } = data;
//             const response = await axios.put(`${BASE_URL}products/update-product/${_id}`, rest);
//             dispatch(setAlert({ text: response.data.message, color: 'success' }));
//             return response.data;
//         } catch (error) {
//             dispatch(setAlert({ text: error.message, color: 'error' }));
//              return rejectWithValue(error.message);
//         }
//     }
// )

// const onLoading = (state) => {
//     state.loading = true;
//     state.error = null;
// }

// const onError = (state, action) => {
//     console.log(action);
//     state.loading = false;
//     state.error = action.payload || 'Something went wrong';
// }

// const productsSlice = createSlice({
//     name: 'products',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(getDetailsProducts.pending, onLoading)
//             .addCase(getDetailsProducts.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.success = true;
//                 state.message = action.payload.message || 'Products fetched successfully';
//                 state.products = action.payload.data;
//             })
//             .addCase(getDetailsProducts.rejected, onError)
//             .addCase(getProducts.pending, onLoading)
//             .addCase(getProducts.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.success = true;
//                 state.message = action.payload.message || 'Products fetched successfully';
//                 state.products = action.payload.data;
//             })
//             .addCase(getProducts.rejected, onError)
//             .addCase(addProduct.pending, onLoading)
//             .addCase(addProduct.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.products = state.products.concat(action.payload.data);
//                 state.message = 'Product added successfully';
//             })
//             .addCase(addProduct.rejected, onError)
//             .addCase(deleteProduct.pending, onLoading)
//             .addCase(deleteProduct.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.products = state.products.filter((v) => v._id !== action.payload);
//                 state.message = 'Product deleted successfully';
//             })
//             .addCase(deleteProduct.rejected, onError)
//             .addCase(editProduct.pending, onLoading)
//             .addCase(editProduct.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.products = state.products.map((v) => 
//                     v._id === action.payload.data._id ? action.payload.data : v
//                 );
//                 state.message = 'Product updated successfully';
//             })
//             .addCase(editProduct.rejected, onError);
//     }
// })

// export default productsSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../utils/baseURL";
import { setAlert } from "./alert.slice";

const initialState = {
    products: [],
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

export const getProducts = createAsyncThunk(
    'products/get',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(BASE_URL + '/allproduct');
            // console.log("response>>>>", response.data.products);
            return response;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const getDetailsProducts = createAsyncThunk(
    'products/getDetailsProducts',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/getProduct/${id}`);
            dispatch(getProducts());
            return response.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const addProduct = createAsyncThunk(
    'products/add',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            // console.log("data", data);
            const response = await axiosInstance.post(BASE_URL + '/addNewProduct', data);
            // console.log("response@@@@@@@@@@@@", response.data);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return response.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/delete',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            // console.log("id@@@@@@@@@@@@", id);
            const response = await axiosInstance.delete(`${BASE_URL}/deleteProduct/${id}`);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            dispatch(getProducts());
            return id;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const editProduct = createAsyncThunk(
    'products/edit',
    async (data, { dispatch, rejectWithValue }) => {
        const { id, ...rest } = data;
        try {
            // console.log("id>>>>>>>>>>", id);
            // console.log("rest>>>>>>>>>>", rest);
            const response = await axiosInstance.put(`${BASE_URL}/updateProduct/${id}`, rest);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return response.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching products...';
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || 'Products fetched successfully';
                state.products = action.payload.data;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch products';
            })
            .addCase(getDetailsProducts.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching detailed products...';
            })
            .addCase(getDetailsProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || 'Detailed products fetched successfully';
                state.products = Array.isArray(action.payload.data) ? action.payload.data : [];
            })
            .addCase(getDetailsProducts.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch detailed products';
            })
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
                state.message = 'Adding product...';
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                // state.products.push(action.payload.data);
                // state.message = action.payload?.message || 'Product added successfully';
                if (Array.isArray(state.products)) {
                    state.products.push(action.payload.data);
                } else {
                    state.products = [action.payload.data];
                }
                state.message = action.payload?.message || 'Product added successfully';
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to add product';
            })
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.message = 'Deleting product...';
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                // state.products = state.products.filter((v) => v._id !== action.payload);
                // state.message = action.payload?.message || 'Product deleted successfully';
                if (Array.isArray(state.products)) {
                    state.products = state.products.filter((product) => product._id !== action.payload);
                }
                state.message = action.payload?.message || 'Product deleted successfully';
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete product';
            })
            .addCase(editProduct.pending, (state) => {
                state.loading = true;
                state.message = 'Updating product...';
            })
            .addCase(editProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                if (Array.isArray(state.products)) {
                    state.products = state.products.map((v) =>
                        v._id === action.payload._id ? action.payload : v
                    );
                }
                state.message = action.payload?.message || 'Product updated successfully';
            })
            .addCase(editProduct.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update product';
            });
    }
});

export default productsSlice.reducer;