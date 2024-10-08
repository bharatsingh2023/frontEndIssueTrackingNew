// src/components/PrivateRoute.jsx
import React, { useEffect, useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { issueTrackingContext } from './Context';
import axios from 'axios';

const PrivateRoute = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(issueTrackingContext);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            axios.get('/BaseUrl/api/v1/validateToken', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                    }
                })
                .catch(error => {
                    if (error.response && error.response.status === 401) {
                        setIsAuthenticated(false);
                        localStorage.clear();
                    }
                });
        } else {
            setIsAuthenticated(false);
        }
    }, [setIsAuthenticated]);

    if (isAuthenticated === null) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '24px',
            }}>
                Loading...
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export { PrivateRoute };
