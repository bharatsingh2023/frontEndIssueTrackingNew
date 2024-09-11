// src/components/JwtValidator.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JwtValidator = ({ setAuthStatus: setIsAuthenticated }) => {
    const [loading, setLoading] = useState(true);

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
                    setLoading(false);
                })
                .catch(error => {
                    if (error.response && error.response.status === 401) {
                        setIsAuthenticated(false);
                        localStorage.clear();
                    }
                    setLoading(false);
                });
        } else {
            console.log("token::", token);
            setIsAuthenticated(false);
            setLoading(false);
        }
    }, [setIsAuthenticated]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '24px',
            }}>
                Validating session...
            </div>
        );
    }

    return null;
};

export default JwtValidator;
