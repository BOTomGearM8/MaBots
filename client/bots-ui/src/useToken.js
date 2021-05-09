import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken, username) => {
    window.sessionStorage.setItem('token', JSON.stringify(userToken));
    
    var map = JSON.parse(window.sessionStorage.getItem('tokenMap'));
    if (map == null)
      map = {}
    map[userToken.token] = username;
    console.log(map)
    window.sessionStorage.setItem('tokenMap', JSON.stringify(map))

    console.log(map)
    setToken(userToken.token);
  };

  const deleteToken = (userToken) => {
    window.sessionStorage.setItem('token', JSON.stringify(userToken));
    
    var map = JSON.parse(window.sessionStorage.getItem('tokenMap'));
    map[userToken.token] = null;
    window.sessionStorage.setItem('tokenMap', JSON.stringify(map))

    console.log(map)
    setToken(null);
  };

  return {
    deleteToken: deleteToken,
    setToken: saveToken,
    token
  }
}