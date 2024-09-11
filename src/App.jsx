import './polyfills';
import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AppRoute from './Utility/AppRoute';
import { IssueTrackingContextProvider, issueTrackingContext } from './components/Context';
import CustomNavbar from './Layout/Navbar';

const App = () => {
  return (
    <>
      <IssueTrackingContextProvider>
        <AppRoute />
      </IssueTrackingContextProvider>
    </>
  );
}

export default App;
