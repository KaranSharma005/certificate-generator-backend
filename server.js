const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);
const upload = require('./middleware/upload');
const path = require('path');
const {generateCertificates} = require('./controllers/index');
const {limiter} = require('./middleware/ratelimit');
const {startServer} = require('./connection');
const {handleUserRegister} = require('./controllers/register')
const cookieParser = require('cookie-parser');
const { authMiddleware } = require('./middleware/authMiddleware');

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
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: process.env.FRONTEND_VITE_URL,
  methods: ['GET', 'POST'],  
  credentials: true,
};
app.use(cors(corsOptions));

startServer();

app.use('/certificates', express.static(path.join(__dirname, 'certificates')));

app.post('/generateCertificate',authMiddleware,limiter,upload, generateCertificates);

app.post('/register', handleUserRegister);

server.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
})