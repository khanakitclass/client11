import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Auth from '../admin/container/Auth/Auth';
// import { useDispatch, useSelector } from 'react-redux';
// import { refreshAccessToken } from '../redux/slice/auth.slice';


function UserRoutes(props) {
    // const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(refreshAccessToken());
    // }, [dispatch]);

    return (
        <Routes>
            <Route exact path='/' element={<Auth />} />
        </Routes>
    );
}

export default UserRoutes;