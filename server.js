const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const serveIndex = require('serve-index');
const fs = require('fs');
const helmet = require('helmet')
const https = require('https')
const app = express();

const db = require("./app/models");
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
});

bodyParser.json({
  limit: "50MB"
})

// Requests come from port 8081, the React side
var corsOptions = {
  origin: "https://localhost:8081"
};

app.use(cors(corsOptions));
app.use(helmet({crossOriginResourcePolicy: { policy: "same-site" }}));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Serve images that were uploaded from /uploads
app.use('/uploads', express.static('uploads'), serveIndex('uploads', {icons: true}));

// Index route
app.get("/", (req, res) => {
    res.json({ message: "Go to https://localhost:8081 to view data." });
});

// Change file location to intended upload folder
const imageUploadPath = 'C:/Users/Denni/Desktop/My File/Coding/Web Dev/art-portfolio-backend/uploads';

// Image uploading logic
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, imageUploadPath)
  },
  filename: function(req, file, cb) {
    cb(null, `${file.originalname}`)
  }
})

const imageUpload = multer({storage: storage})

app.post('/image-upload', imageUpload.array("uploaded"), (req, res) => {
  console.log('POST request received to /image-upload.');
  //console.log('Axios POST body: ', req.body);
 
  res.send('POST request recieved on server to /image-upload.');
})

// Image deletion
app.post('/image-delete', (req, res) => {
  console.log('POST request recevied to /image-delete')
  const fileURI = `${imageUploadPath}/${req.body.value}`;
  fs.unlink(fileURI, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(fileURI + ' is deleted.');
    }
  });
  res.send('POST request recevied on server to /image-delete');
})

// Model routes
require("./app/routes/artwork.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/token.routes")(app);
require("./app/routes/email.routes")(app);
require("./app/routes/feedback.routes")(app);

// custom 404
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

// custom error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// set port, listen for requests
const PORT = process.env.PORT || 8080;
https
  .createServer(
		// Provide the private and public key to the server by reading each
		// file's content with the readFileSync() method.
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  )
  .listen(PORT, () => {
    console.log("Server is running on port 8080.");
  });