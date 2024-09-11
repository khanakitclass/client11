// // axiosInstance.js
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { BASE_URL } from './baseURL';



// const axiosInstance = axios.create({
//     baseURL: BASE_URL,
//     withCredentials: true, // Allow cookies to be sent with requests
// });

// axiosInstance.interceptors.request.use(
//     async (config) => {
//         const token = Cookies.get('accessToken');
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// axiosInstance.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     async (error) => {
//         const originalRequest = error.config;

//         if (error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             try {
//                 const response = await axiosInstance.post(BASE_URL + '/users/refresh-token', {
//                     refreshToken: Cookies.get('refreshToken'),
//                 });

//                 console.log("newww");

//                 if (response.status === 200) {
//                     Cookies.set('accessToken', response.data.accessToken, { httpOnly: true, secure: true });
//                     Cookies.set('refreshToken', response.data.refreshToken, { httpOnly: true, secure: true });

//                     axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
//                     originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;

//                     return axiosInstance(originalRequest);
//                 }
//             } catch (error) {
//                 // const { store, persistor } = configureStore();
//                 // store.dispatch(logout());
//                 console.log('Refresh token failed', error);
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;
// axiosInstance.js
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from './baseURL';
// import { logout } from '../redux/slice/auth.slice';

// import { configureStore } from '../redux/store';
// import { logout } from '../redux/slice/auth.slice';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Allow cookies to be sent with requests
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// axiosInstance.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     async (error) => {
//         const originalRequest = error.config;
//         if (error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             try {
//                 const response = await axios.post(`${BASE_URL}/refreshToken`, { 
//                     refreshToken: Cookies.get('refreshToken')
//                 });

//                 if (response.status === 200) {
//                     Cookies.set('accessToken', response.data.accessToken, { secure: true });
//                     axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
//                     originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
//                     return axiosInstance(originalRequest);
//                 }
//             } catch (err) {
//                 console.log("error>>>>>>>>",err);
//                 store.dispatch(logout());
//             }
//         }
//         return Promise.reject(error);
//     }
// );

// axiosInstance.interceptors.response.use(
//     (response) => {
//         console.log("response>?>>>>>>>>>>>>>>",response.data.accessToken);
//         return response;
//     },
//     async (error) => {
//         const originalRequest = error.config;
// console.log("originalRequest>>>>>>>>>>>>",originalRequest);
//         if (error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             try {
//                 const response = await axios.post('/refreshToken');

//                 if (response.status === 200) {
//                     Cookies.set('accessToken', response.data.accessToken, { secure: true });
//                     Cookies.set('refreshToken', response.data.refreshToken, { secure: true });

//                     axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
//                     originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;

//                     return axiosInstance(originalRequest);
//                 }
//                 // originalRequest._retry = true;
//                 // try {
//                 //     const rtoken = Cookies.get('refreshToken');
//                 //     await axios.post(BASE_URL + 'users/refresh-token', rtoken);
//                 //     return axios(originalRequest);
//                 // } catch (refreshError) {
//                 //     console.error('Token refresh failed:', refreshError);
//                 // }
//             } catch (err) {
//                 // console.log('Refresh token failed', err);
//                 // throw new Error(err);

//                 // Handle logout or redirect to login
//                 // const { store, persistor } = configureStore();
//                 // store.dispatch(logout());
//                 console.log("instanceeeeeeeeeeee", err);
//             }
//         }

//         return Promise.reject(error);
//     }
// );

export default axiosInstance;
