const firebase = require('firebase')


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
const database = firebase.database()
exports.database