// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomNavbar from './Layout/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Chat from './components/Chat';
import Signup from './components/Signup';
import Login from './components/Login';

const App = () => {

  return (
    <>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<CustomNavbar />} />

        <Route path="/chat" element={<Chat />} />

      </Routes>

    </>
  );
}

export default App;
