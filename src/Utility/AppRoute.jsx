// src/routes/AppRoute.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Login';
import { PrivateRoute } from '../components/PrivateRoute';
import TaskTable from '../components/TaskList';
import { issueTrackingContext } from '../components/Context';
import ProjectList from '../components/ProjectList';
import IssueTable from '../components/IssueList';
import CustomNavbar from '../Layout/Navbar';
import JwtValidator from './JwtValidator';

const AppRoute = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(issueTrackingContext);

    return (
        <>
            <JwtValidator setAuthStatus={setIsAuthenticated} />
            {isAuthenticated && <CustomNavbar />}

            <div style={{ paddingTop: '95px' }}>
                <Routes>
                    <Route path="/" element={isAuthenticated ? <Navigate to="/projectList" /> : <Login />} />
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/projectList" /> : <Login />} />
                    <Route path="/verify" element={isAuthenticated ? <Navigate to="/projectList" /> : <Login />} />

                    {/* Protected routes */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/taskList/:project_id" element={<TaskTable />} />
                        <Route path="/projectList" element={<ProjectList />} />
                        <Route path="/issueList/:project_id" element={<IssueTable />} />
                    </Route>

                    {/* Catch-all route for unmatched URLs */}
                    <Route path="*" element={isAuthenticated ? <Navigate to="/projectList" /> : <Login />} />
                </Routes>
            </div>
        </>
    );
};

export default AppRoute;
