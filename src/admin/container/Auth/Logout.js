import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/slice/auth.slice';

const Logout = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth);

    useEffect(() => {
        if (user && user._id) {
            dispatch(logout(user._id));
        }
    }, []);

    return (
        <div>
            aadasdd
        </div>
    )
}

export default Logout
