const firebase = require('firebase')

const firebaseConfig = {
  apiKey: "**************************", // ask for key
  authDomain: "mabots-cb557.firebaseapp.com",
  databaseURL: "https://mabots-cb557-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mabots-cb557",
  storageBucket: "mabots-cb557.appspot.com",
  messagingSenderId: "723047465072",
  appId: "1:723047465072:web:6cb15e5231cb6ac794b4b5",
  measurementId: "G-JNWWJWH025"
}

firebase.initializeApp(firebaseConfig)

exports.auth = firebase.auth()
exports.fs = firebase.firestore()
exports.database = firebase.database()
