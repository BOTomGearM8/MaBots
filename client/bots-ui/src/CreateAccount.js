import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './CreateAccount.css';

async function createUser(userData) {
    return fetch('http://localhost:8080/create-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
      .then(data => data.json())
}

export default function CreateAccount({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [passwordConfirmation, setPasswordConfirmation] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    if (password === passwordConfirmation) {
      const token = await createUser({
        username,
        password,
        passwordConfirmation
      });
      setToken(token, username);
    } else {
      alert("Password doesn't match confirmation");
    }
  }

  return(
    <div className="register-wrapper">
      <h1>Create your account</h1>
      <form className = "sign-form" onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input className = "sign-input" type="text" onChange={e => setUserName(e.target.value)}/>
        </label>
        <label>
          <p>Password</p>
          <input className = "sign-input" type="password" onChange={e => setPassword(e.target.value)}/>
        </label>
        <label>
          <p>Password Confirmation</p>
          <input className = "sign-input" type="password" onChange={e => setPasswordConfirmation(e.target.value)}/>
        </label>
        <div>
          <button className = "sign-button" type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

CreateAccount.propTypes = {
  setToken: PropTypes.func.isRequired
};