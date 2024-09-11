// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import Cookies from 'js-cookie';
// import axiosInstance from '../../utils/axiosInstance';
// import { setAlert } from './alert.slice';

// const handleErrors = (error, dispatch, rejectWithValue) => {
//     const errorMessage = error.response?.data?.message || 'An error occurred';
//     dispatch(setAlert({ text: errorMessage, color: 'error' }));
//     return rejectWithValue(error.response?.data || { message: errorMessage });
// };

// export const login = createAsyncThunk(
//     'auth/login',
//     async ({ email, password }, { dispatch, rejectWithValue }) => {
//         try {
//             const response = await axiosInstance.post('users/login', { email, password });
//             if (response.status === 200) {
//                 console.log("response.data.dataresponse.data.data", response.data.data);
//                 dispatch(setAlert({ text: response.data.message, color: 'success' }));
//                 return response.data.data.loggedInUser;
//             }
//         } catch (error) {
//             return handleErrors(error, dispatch, rejectWithValue);
//         }
//     }
// );

// export const refreshAccessToken = createAsyncThunk(
//     'auth/refreshAccessToken',
//     async (_, { dispatch, rejectWithValue }) => {
//         try {
//             const response = await axiosInstance.post('users/refresh-token');

//             if (response.status === 200) {
//                 Cookies.set('accessToken', response.data.accessToken, { secure: true });
//                 return response.data.accessToken;
//             }
//         } catch (error) {
//             return rejectWithValue(error.response?.data)
//         }
//     }
// );

// const authSlice = createSlice({
//     name: 'auth',
//     initialState: {
//         user: null,
//         isAuthenticated: false,
//         loading: false,
//         error: null,
//         loggedIn: false,
//     },
//     reducers: {
//         logout: (state) => {
//             console.log("logoutttt");
//             Cookies.remove('accessToken');
//             Cookies.remove('refreshToken');
//             state.user = null;
//             state.isAuthenticated = false;
//             state.loggedIn = false;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(login.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(login.fulfilled, (state, action) => {
//                 console.log(action.payload);
//                 state.user = action.payload;
//                 state.isAuthenticated = true;
//                 state.loading = false;
//                 state.loggedIn = true;
//             })
//             .addCase(login.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload?.message || "Login Failed";
//             })
//             .addCase(refreshAccessToken.fulfilled, (state, action) => {
//                 console.log("okk");
//                 state.isAuthenticated = true;
//                 state.loggedIn = true;
//             })
//             .addCase(refreshAccessToken.rejected, (state, action) => {
//                 console.log("refreshAccessToken.rejected");
//                 state.user = null;
//                 state.accessToken = null;
//                 state.isAuthenticated = false;
//                 state.loggedIn = false;
//                 state.error = action.payload?.message || "Refresh token failed";
//             });
//     },
// });

// export const { logout } = authSlice.actions;

// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import axiosInstance from '../../utils/axiosInstance';
import { setAlert } from './alert.slice';
import { jwtDecode } from "jwt-decode";

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { dispatch, rejectWithValue }) => {
        try {

            const response = await axiosInstance.post('/login', { email, password });
            // console.log(" response.data.AccessToken", response.data.AccessToken);
            // console.log(" response.data.refreshToken", response.data.refreshToken);
            if (response.status === 200) {

                const { exp } = jwtDecode(response.data.AccessToken);
                const expiresIn = exp * 1000 - Date.now();


                // localStorage.setItem("id", response.data.user._id);
                sessionStorage.setItem("id",response.data.user._id);
                sessionStorage.setItem("role",response.data.user.role);
                Cookies.set("accessToken", response.data.AccessToken, { secure: true });
                Cookies.set("refreshToken", response.data.refreshToken, { secure: true });

                setTimeout(() => {
                    Cookies.remove("accessToken");
                }, expiresIn);
                // console.log("response>>>>>>>>>>>>",response.data);
                dispatch(setAlert({ text: response.data.message, color: 'success' }));
                return response.data.AccessToken;
            }
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async ({ id, navigate }, { dispatch, rejectWithValue }) => {
        try {

            const response = await axiosInstance.post(`/logout/${id}`);

            if (response.status === 200) {
                dispatch(setAlert({ text: response.data.message, color: 'success' }));

                navigate('/');
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                return response.data.user;
            }
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const refreshAccessToken = createAsyncThunk(
    'auth/refreshAccessToken',
    async (_, { dispatch, rejectWithValue }) => {
        // const { auth } = getState();
        // if (auth.isLoggedOut) {
        //     return rejectWithValue({ message: 'User logged out' });
        // }
        const refreshToken = Cookies.get("refreshToken");
        // console.log("refreshToken", refreshToken);

        if (!refreshToken) {
            return rejectWithValue({ message: "No refresh token available" })
        }
        try {
            const response = await axiosInstance.post('/refreshToken', { refreshToken });

            if (response.data.status === 200) {
                const { exp } = jwtDecode(response.data.refreshToken);
                // console.log("exp>>>>>>>>>>",exp);
                const expiresIn = exp * 1000 - Date.now();

                // console.log("expiresIn", expiresIn);
                Cookies.set('accessToken', response.data.accessToken, { secure: true });
                Cookies.set('refreshToken', response.data.refreshToken, { secure: true });

                setTimeout(() => {
                    Cookies.remove("accessToken");
                    Cookies.remove("refreshToken");
                    dispatch(logout());
                }, expiresIn);

                return response.data.accessToken;
            }

            if (response.data.status === 500) {
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                dispatch(logout());
                // navigate("/");
            };
        } catch (error) {

            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: true,
        loading: false,
        error: null,
        loggedIn: false,
        isLoggedOut: false,
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                // console.log("Login fulfilled with user:", action.payload);
                state.user = action.payload;
                state.isAuthenticated = true;
                state.loading = false;
                state.loggedIn = true;
                state.isLoggedOut = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Login Failed";
            })
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                // console.log("Token refresh successful");
                state.isAuthenticated = true;
                state.loggedIn = true;
            })
            .addCase(refreshAccessToken.rejected, (state, action) => {
                // console.log("Token refresh failed");
                state.user = null;
                state.isAuthenticated = false;
                state.loggedIn = false;
                state.error = action.payload?.message || "Refresh token failed";
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = null;
                state.loggedIn = false;
                state.isLoggedOut = true;

            })
    },
});


export default authSlice.reducer;
