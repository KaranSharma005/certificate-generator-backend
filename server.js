const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);
const upload = require('./middleware/upload');
const path = require('path');
const {generateCertificates} = require('./controllers/index');

require('dotenv').config();
const PORT = process.env.PORT;

const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_VITE_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});
app.set('io',io);

const corsOptions = {
  origin: process.env.FRONTEND_VITE_URL,
  methods: ['GET', 'POST'],  
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/certificates', express.static(path.join(__dirname, 'certificates')));

io.on('connection', (socket) => {
  console.log('a new client connected');  
      socket.on('disconnect', (socket) => {
          console.log('a client disconnected');
  })
})

app.post('/generateCertificate',upload, generateCertificates);

server.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
})