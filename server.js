const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const fs = require('fs');
const app = express();
const server = http.createServer(app);

const io = socketIo(server);

const port = 80;

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// recieve pics from server
app.post('/server-uploads', (req, res) => {
  const base64Image = req.body.image; //sending image as base64 / sendable stream
  const imageBuffer = Buffer.from(base64Image, 'base64');

  // send image to all connected clients (via client.py)
  io.emit('image', {
    data: base64Image, // send base64 to all clients
    filename: req.body.filename, // send file name
  });

  res.status(200).send('Image received and broadcasted successfully');
});

// recieve images from client.py 
app.post('/uploads', upload.single('image'), (req, res) => {
  // save image
  const imagePath = req.file.path; // uploaded image path

  // send image to clients
  io.emit('image', {
    data: fs.readFileSync(imagePath, 'base64'), // read and encode image as base64
    filename: req.file.originalname, // send filename
  });

  res.status(200).send('Image uploaded and broadcasted successfully');
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
