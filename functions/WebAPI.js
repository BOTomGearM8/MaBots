const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./DataBaseConfig');
const fileStorage = require('./FileStorage.js');
const game = require('./Engine.js');
const bodyParser = require('body-parser');
const multer = require('multer');
const { auth } = require('firebase-admin');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

db.auth.onAuthStateChanged(user => {
  if (user) {
    console.log('User logged in: ', user.displayName)
  } else {
    console.log('User logged out');
  }
})

// Login endpoint
app.use('/login', (req, res) => {
  var jsonObj = {"token1" : "tokenVal"};
  
  console.log(req.body)

  db.database.ref("customPath").set(jsonObj, function(error) {
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

app.use('/signup', (req, res) => {
  console.log(req.body)

  const email = req.body.email
  const username = req.body.username
  const password = req.body.password

  db.auth.createUserWithEmailAndPassword(email, password).then(cred => {
    cred.user.updateProfile({
      displayName: username
    }).then(function() {
      res.send('Success');
    }, function(error) {
      res.send('Fail on username change');
    })
  }, function(error) {
    res.send('Fail on create user');
  });
});

app.use('/logout', (req, res) => {
  db.auth.signOut().then(() => {
    res.send('user loged out')
  })
});

app.use('/login-dev', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  db.auth.signInWithEmailAndPassword(email, password).then(cred => {
    cred.user.getIdTokenResult().then((token) => {
      res.send(token)
    })
  }, function(error) {
    console.log(error.message)
    res.send('fail')
  })
});

// Fetch all files related to a user
app.post('/fetchUserFiles', async (req, res) => {
    var prefix = req.body.user;

    console.log('User we got:'  + req.body.user)
  
    const options = {
      prefix: prefix,
    };

    // Lists files in the bucket, filtered by a prefix
    const [files] = await fileStorage.bucket.getFiles(options);

    console.log('Files:');
    files.forEach(file => {
      console.log(file.name);
    });

    if (files[0]) {
      res.send({
        file : files[0].name
      });
    }
});

// Delete all files related to a user
app.post('/deleteUserFiles', async (req, res) => {
  var prefix = req.body.user;

  console.log('User we got:'  + req.body.user)

  const options = {
    prefix: prefix,
  };

  fileStorage.bucket.deleteFiles({
    prefix: prefix
  }, function(err) {
    if (!err) {
      console.log('Deleted user files');
    }
  });

  // Lists files in the bucket, filtered by a prefix
  const [files] = await fileStorage.bucket.getFiles(options);

  console.log('Files:');
  files.forEach(file => {
    console.log(file.name);
  });
  
});

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limiting files size to 5 MB
  },
});

// Upload file endpoint
app.post('/upload', uploader.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).send('Error, could not upload file');
      return;
    }

    console.log('Got file from frontend  ' + req.file.originalname);

    // Create new blob in the bucket referencing the file
    const blob = fileStorage.bucket.file(req.file.originalname);

    // Create writable stream and specifying file mimetype
    const blobWriter = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    console.log('Blob created');

    blobWriter.on('error', (err) => next(err));

    blobWriter.on('finish', () => {
      // Assembling public URL for accessing the file via HTTP
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        fileStorage.bucket.name
      }/o/${encodeURI(blob.name)}?alt=media`;

      // Return the file name and its public URL
      res
        .status(200)
        .send({ fileName: req.file.originalname, fileLocation: publicUrl });
    });

    console.log('File uploaded to storage');

    // When there is no more data to be consumed from the stream
    blobWriter.end(req.file.buffer);
  } catch (error) {
    res.status(400).send(`Error, could not upload file: ${error}`);
    return;
  }
});


// Download file by username
app.post ('/download', async (req, res) => {
  let destFilename = './exp-bot1.js';
  var options = {
    // The path to which the file should be downloaded, e.g. "./file.txt"
    destination: destFilename,
  };

  // Downloads the file
  await fileStorage.bucket.file(req.body.filename1).download(options);
  console.log("First bot downloaded");

  destFilename = './exp-bot2.js';
  options = {
    destination: destFilename,
  };
  await fileStorage.bucket.file(req.body.filename1).download(options);
  console.log("Second bot downloaded");
});


// Start engine and return game states
app.post('/play', async (req, res) => {
  res.send(game.engine());
});


app.listen(8080, () => console.log('API is running on http://localhost:8080/'));