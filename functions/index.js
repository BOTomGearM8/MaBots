const express = require('express');
const cors = require('cors');
const app = express();
var firebase = require('firebase')


const firebaseConfig = {
  apiKey: "AIzaSyAVa8jpyTBu4sy36kPXd1G2H_2MGEv92Ms",
  authDomain: "mabots-cb557.firebaseapp.com",
  databaseURL: "https://mabots-cb557-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mabots-cb557",
  storageBucket: "mabots-cb557.appspot.com",
  messagingSenderId: "723047465072",
  appId: "1:723047465072:web:6cb15e5231cb6ac794b4b5",
  measurementId: "G-JNWWJWH025"
};
firebase.initializeApp(firebaseConfig)
let database = firebase.database()

app.use(cors());

app.use('/login', (req, res) => {
  var jsonObj = {"token1" : "tokenVal"};
  database.ref("customPath").set(jsonObj, function(error) {
    if (error) {
      // The write failed...
      console.log("Failed with error: " + error)
    } else {
      // The write was successful...
      console.log("success")
    }
});
  res.send({
    token: 'test123'
  });
});

app.listen(8080, () => console.log('API is running on http://localhost:8080/login'));