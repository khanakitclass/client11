// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Navigate, Outlet } from 'react-router-dom';
// import { refreshAccessToken } from '../redux/slice/auth.slice';

// function PrivateRoutes(props) {
//     const { isAuthenticated } = useSelector((state) => state.auth);

//     console.log(isAuthenticated);

//     const dispatch = useDispatch();

//     useEffect(() => {
//         dispatch(refreshAccessToken());
//     }, [dispatch]);

//     return (
//         isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
//     );
// }

// export default PrivateRoutes;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { refreshAccessToken } from '../redux/slice/auth.slice';

function PrivateRoutes() {
    const { isAuthenticated, isLoggedOut } = useSelector((state) => state.auth);

    // console.log("Is authenticated:", isAuthenticated);
    // console.log("Is logged out:", isLoggedOut);

    const dispatch = useDispatch();

    useEffect(() => {
        if (isAuthenticated && !isLoggedOut) {
            dispatch(refreshAccessToken());
        }
    }, [dispatch, isAuthenticated, isLoggedOut]);

 
    return (
        isAuthenticated ? <Outlet /> : <Navigate to="/"  />
    );
}

export default PrivateRoutes;
