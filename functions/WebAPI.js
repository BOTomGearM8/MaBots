const express = require('express');
const cors = require('cors');
const app = express();
const dbConfig = require('./DataBaseConfig');
const fileStorage = require('./FileStorage.js');
const bodyParser = require('body-parser');
const multer = require('multer');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

// Login endpoint
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

app.listen(8080, () => console.log('API is running on http://localhost:8080/'));