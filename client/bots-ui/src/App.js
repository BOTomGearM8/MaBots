import { useState } from 'react'
import useToken from './useToken';
import './App.css';
import Dashboard from './Dashboard';
import Header from './Header';
import Login from './Login';
import Profile from './Profile';
import CreateAccount from './CreateAccount';

function App() {
  const { token, setToken, deleteToken } = useToken();
  const [headerState, setHeaderState] = useState('start');
  const [dashboardState, setDashboardState] = useState('start');

  let toLogin = () => {
    setHeaderState('loginClicked');
  }

  let doLogout = () => {
    setHeaderState('start');
    deleteToken(token);
  }

  let toRegister = () => {
    setHeaderState('registerClicked');
  }

  let toProfile = () => {
    setHeaderState('profileClicked');
  }

  let toStart = () => {
    setHeaderState('start');
    setDashboardState('start');
  }

  let loginSubmitted = () => {
    setHeaderState('start');
  }

  return (
    <div className = "wrapper">
      <Header toLogin = {toLogin} headerState = {headerState}
              token = {token}  toRegister = {toRegister}
              toProfile = {toProfile} doLogout = {doLogout}
              toStart = {toStart}/>
      {headerState === 'start' && <Dashboard dashboardState = {dashboardState}
                                             setDashboardState = {setDashboardState}/>}
      {headerState === 'loginClicked' && <Login setToken={setToken} 
                                                loginSubmitted = {loginSubmitted} ></Login>}
      {headerState === 'registerClicked' && <CreateAccount setToken={setToken}></CreateAccount>}
      {headerState === 'profileClicked' && <Profile setToken={setToken}></Profile>}

      <footer> &copy; BottomGear 2021 </footer>
    </div>
  );
}

export default App;