import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';
import Dashboard from './Dashboard';
import Login from './Login';
import Preferences from './Preferences';
import useToken from './useToken'

function App() {
  const { token, setToken } = useToken();

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
    <div className="wrapper">
      <Dashboard></Dashboard>
    </div>
  );
}

export default App;