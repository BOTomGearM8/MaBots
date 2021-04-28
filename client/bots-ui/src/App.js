import { useState } from 'react'
import './App.css';
import Dashboard from './Dashboard';
import Header from './Header';

function App() {
  const [headerState, setHeaderState] = useState('start');

  let toLogin = () => {
    setHeaderState('loginClicked');
  }

  return (
    <div className = "wrapper">
      <Header toLogin = {toLogin} headerState = {headerState}></Header>
      {headerState == 'start' && <Dashboard></Dashboard>}
    </div>
  );
}

export default App;