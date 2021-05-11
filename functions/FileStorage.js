var admin = require("firebase-admin");

var serviceAccount = require("./resources/mabots-cb557-firebase-adminsdk-jyh9x-2d8c96c242.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "mabots-cb557.appspot.com"
});

exports.bucket = admin.storage().bucket();
exports.storage = admin.storage();
