// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../components/Login';
import { PrivateRoute } from '../components/PrivateRoute';
import Home from '../Layout/Home';

const AppRoute = () => {

    return (
        <>

            <Routes>
                <Route path="/" element={<Login />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/home" element={<Home />} />
                </Route>
            </Routes>

        </>
    );
}

export default AppRoute;
