import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import statement
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

// Create a root element using ReactDOM.createRoot
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
