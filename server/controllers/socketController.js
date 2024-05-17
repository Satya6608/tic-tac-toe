// socketHandlers.js
const User = require('../models/user'); // Assuming User model is defined in a separate file
const chatController = require('../controllers/chatController');
const connectedUsers = new Map();
function handleSocketConnection(io) {
  io.on('connection', (socket) => {
    // When a user connects, update their online status to true
    socket.on('authenticate', (userId) => {
        connectedUsers.set(userId, socket.id);
        User.findByIdAndUpdate(userId, { online: true }, { new: true })
        .then((user) => {
            console.log(`${user} connected`);
        })
        .catch((error) => {
            console.error('Error updating online status:', error);
        });
    });
    // Handle player joining
    socket.on('joinGame', (opponentId) => {
        // Check if another player is available to pair
        if (connectedUsers.get(opponentId)) {
        const playersId = Array.from(connectedUsers.keys());
        const currentPlayer = playersId[1];
        playersId.forEach(playerId => {
          const opponentId = playersId.find(id => id !== playerId); // Find opponent ID
          io.to(connectedUsers.get(playerId)).emit('startGame', { opponent: opponentId, currentPlayer : currentPlayer });
        });
        }
    });

    // Handle player move
    socket.on('makeMove', (i, j) => {
      const updatedGameStatei = i; // Example function to process move
      const updatedGameStatej = j; // Example function to process move

      // Emit updated game state to both players
      io.emit('gameStateUpdated', updatedGameStatei, updatedGameStatej);
    });

    socket.on("setup", (userData) => {
      console.log(userData, "dfghjklkjhgfdfghjkljghdffghjkljhgfds");
      socket.join(userData._id);
      socket.emit("connected");
    });

    // socket.on("join chat", (room) => {
    //   socket.join(room);
    //   console.log("User Joined Room: " + room);
    // });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
        console.log(chat, "new message")
      if (!chat.users) return console.log("chat.users not defined");

      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
        console.log("user", newMessageRecieved)
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });

    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });

    // When a user disconnects, update their online status to false
    socket.on('disconnect', async() => {
        let userId = ""; // Implement this function to get userId from socket
        for (let [cUserId, socketId] of connectedUsers) {
            if (socketId === socket.id) {
                userId = cUserId;
            connectedUsers.delete(cUserId);
            break;
            }
        }
        if(userId){
          await User.findByIdAndUpdate(userId, { online: false }, { new: true })
          .then((user) => {
            console.log(`${user} disconnected`);
          })
          .catch((error) => {
            console.error('Error updating online status:', error);
          });
        }
    });

    // Other socket event handlers...
  });
}

module.exports = { handleSocketConnection };
