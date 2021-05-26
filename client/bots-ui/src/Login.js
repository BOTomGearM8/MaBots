import React, { useState } from 'react';
import { Link } from 'react-scroll'
import PropTypes from 'prop-types';

import './Login.css';

async function loginUser(credentials) {
    return fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
}

export default function Login(props) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const resp = await loginUser({
      email,
      password
    });
    console.log(resp);
    if (resp.error === "fail") {
      alert("User or password incorrect");
    } else {
      props.setToken(resp.token, resp.username);
      props.loginSubmitted();
    }
  }

  return(
    <div className="login-wrapper">
      <Link activeClass="active" to="login-h1" spy={true} smooth={true}/>
      <h1 id="login-h1">Please Log In</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          <p>E-mail</p>
          <input className = "login-input" type="text" onChange={e => setEmail(e.target.value)}/>
        </label>
        <label>
          <p>Password</p>
          <input className = "login-input" type="password" onChange={e => setPassword(e.target.value)}/>
        </label>
        <div>
          <button className = "login-button" type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};