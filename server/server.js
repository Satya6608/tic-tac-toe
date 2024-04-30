const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http"); // Require the http module
const socketIo = require("socket.io");
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");
const { connectToDatabase } = require("./utils/dbConnection");
const env = require("dotenv");

env.config();
const app = express();
const PORT = process.env.PORT || 7000;

// Connect to the database
connectToDatabase();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api", authRoutes);
app.use("/api", gameRoutes);

// Create an HTTP server using Express app
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT'] // Adjust the methods as needed
  }
});

const connectedUsers = new Map();
// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected',socket.id);

  socket.on('authenticate', (userId) => {
    console.log('User authenticated', userId);
    connectedUsers.set(userId, socket.id);
    console.log('connectedUsers',connectedUsers);
    console.log(isUserOnline(userId));
  });

  // Handle disconnection and remove user from connected users list
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    for (let [userId, socketId] of connectedUsers) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });

  // // Handle game logic and events here
  // socket.on('move', (cellIndex) => {
  //   console.log('Move',cellIndex);
  //   // Handle move logic here
  //   // Emit 'update' event with updated board state
  //   // io.emit('update', updatedBoard);
  //   // // Check for game over condition
  //   // if (gameOver) {
  //   //   // Emit 'gameOver' event
  //   //   io.emit('gameOver');
  //   // }
  // });

  // socket.on('disconnect', () => {
  //   console.log('User disconnected');
  //   // Emit 'playerDisconnected' event
  //   io.emit('playerDisconnected');
  // });
});

function isUserOnline(userId) {
  console.log('isUserOnline', userId);
  return connectedUsers.has(userId);
}

// Example usage
// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
