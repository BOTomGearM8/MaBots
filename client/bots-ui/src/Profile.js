import React, { useState, useEffect } from 'react';
import axios from 'axios';

async function fetchBot(user) {
    var res = await axios({
      method: 'post',
      url: 'http://localhost:8080/fetchUserFiles',
      data: JSON.stringify({user : user}),
      headers: { 'Content-Type': 'application/json' },
    });

    console.log(res.data.file);

    return res.data.file;
}

export default function Profile() {
    const tokenString = window.sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    const mapString = window.sessionStorage.getItem('tokenMap');
    const map = JSON.parse(mapString);
    const user = map[userToken.token];

    const [selectedFile, setSelectedFile] = useState();
    const [botName, setBotName] = useState();
    const [isLoading, setLoading] = useState(true);

    let onFileChange = event => { 
       setSelectedFile(event.target.files[0]); 
    }; 
       
    let onFileUpload = async() => { 
        try {
            // await axios({
            //   method: 'post',
            //   url: 'http://localhost:8080/deleteUserFiles',
            //   data: JSON.stringify({user : user}),
            //   headers: { 'Content-Type': 'application/json' },
            // });

            // Creating a FormData object
            let fileData = new FormData();
            // Setting the 'image' field and the selected file
            fileData.set(
              'image',
              selectedFile,
              `${user}-${selectedFile.name}`
            );

            await axios({
              method: 'post',
              url: 'http://localhost:8080/upload',
              data: fileData,
              headers: { 'Content-Type': 'multipart/form-data' },
            });

            setBotName(`${user}-${selectedFile.name}`);
        } catch (error) {
          console.log('error on fronted upload');
        }
    };

    useEffect(() => {
      fetchBot(user).then(res =>
        {
          setBotName(res);
          setLoading(false);
        });
    }, []);

    return (
        <div className="profile-wrapper">
            <h1> {user} </h1>
            <h2> My Bot </h2>
            <div>
                {isLoading ? <p> No bot added.. </p> : <p> {botName} </p>}
                <input type="file" onChange={onFileChange} /> 
                <button onClick={onFileUpload}> 
                  Upload bot
                </button> 
            </div>
        </div>
    );
}