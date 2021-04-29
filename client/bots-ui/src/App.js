import { useState } from 'react'
import useToken from './useToken';
import './App.css';
import Dashboard from './Dashboard';
import Header from './Header';
import Login from './Login';
import CreateAccount from './CreateAccount';

function App() {
  const { token, setToken } = useToken();
  const [headerState, setHeaderState] = useState('start');

  let toLogin = () => {
    setHeaderState('loginClicked');
  }

  let toRegister = () => {
    setHeaderState('registerClicked');
  }
  
  return (
    <div className = "wrapper">
      <Header toLogin = {toLogin} headerState = {headerState} token = {token}  toRegister = {toRegister} />
      {headerState === 'start' && <Dashboard/>}
      {headerState === 'loginClicked' && <Login path = "/login" setToken={setToken}></Login>}
      {headerState === 'registerClicked' && <CreateAccount path = "/register" setToken={setToken}></CreateAccount>}
    </div>
  );
}

export default App;