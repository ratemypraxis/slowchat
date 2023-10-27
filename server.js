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

// Endpoint to receive images from the server
app.post('/server-uploads', (req, res) => {
  const base64Image = req.body.image; // Assuming the image is sent as a base64 string
  const imageBuffer = Buffer.from(base64Image, 'base64');

  // Emit the image to connected clients (Raspberry Pi 2)
  io.emit('image', {
    data: base64Image, // Sending base64 to clients
    filename: req.body.filename, // Send the filename
  });

  res.status(200).send('Image received and broadcasted successfully');
});

// Endpoint to receive images from the client
app.post('/uploads', upload.single('image'), (req, res) => {
  // Process the uploaded image (e.g., save it)
  const imagePath = req.file.path; // Path to the uploaded image

  // Emit the image to connected clients (Raspberry Pi 2)
  io.emit('image', {
    data: fs.readFileSync(imagePath, 'base64'), // Read and encode the image as base64
    filename: req.file.originalname, // Send the original filename
  });

  res.status(200).send('Image uploaded and broadcasted successfully');
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
