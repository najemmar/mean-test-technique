require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const rateLimit = require('express-rate-limit');

const userRoutes = require('./routes/users');
const articleRoutes = require('./routes/articles');
const commentRoutes = require('./routes/comments');
const socket = require('./socket'); 

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
socket.init(server);

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many requests, please try again later.'
});
app.use('/api/users', authLimiter);

app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(3000, () => console.log('Server running on port 3000'));
  })
  .catch(err => console.error('MongoDB connection error:', err));