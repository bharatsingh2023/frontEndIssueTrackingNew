// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Layout/Home';
import CustomNavbar from './Layout/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Chat from './components/Chat';

const App = () => {
  console.log(typeof global !== 'undefined');
  return (
    <>
      console.log(typeof global !== 'undefined');
      <CustomNavbar />

      <div className="main-content container mt-5 pt-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />

        </Routes>
      </div>
    </>
  );
}

export default App;
