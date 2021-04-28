const express = require('express');
const cors = require('cors');
const app = express();
const dbConfig = require('./DataBaseConfig')


app.use(cors());

app.use('/login', (req, res) => {
  var jsonObj = {"token1" : "tokenVal"};
  
  dbConfig.database.ref("customPath").set(jsonObj, function(error) {
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