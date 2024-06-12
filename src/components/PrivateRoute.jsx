import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import Home from '../Layout/Home'
const PrivateRoute = () => {

    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;




    return (
        <>
            {isAuthenticated ? <Outlet /> : <Navigate to="/" />}

        </>
    )
}

export { PrivateRoute } 