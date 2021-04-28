import { useState } from 'react'
import useToken from './useToken';
import './App.css';
import Dashboard from './Dashboard';
import Header from './Header';
import Login from './Login';

function App() {
  const { token, setToken } = useToken();
  const [headerState, setHeaderState] = useState('start');

  let toLogin = () => {
    setHeaderState('loginClicked');
  }

  return (
    <div className = "wrapper">
      <Header toLogin = {toLogin} headerState = {headerState} token = {token}></Header>
      {headerState === 'start' && <Dashboard></Dashboard>}
      {headerState === 'loginClicked' && <Login setToken={setToken}></Login>}
    </div>
  );
}

export default App;