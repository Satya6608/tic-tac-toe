// socketHandlers.js
const User = require('../models/user'); // Assuming User model is defined in a separate file
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
    socket.on('joinGame', (userId) => {
        // Check if another player is available to pair
        if (connectedUsers.size === 2) {
        const players = Array.from(connectedUsers.values());
        const playersId = Array.from(connectedUsers.keys());
        const player1 = players[0];
        const currentPlayer = playersId[1];
        const player2 = players[1];
        const player1Id = playersId[0];
        const player2Id = playersId[1];
        io.to(player1).emit('startGame', { opponent: player2Id, currentPlayer : currentPlayer});
        io.to(player2).emit('startGame', { opponent: player1Id, currentPlayer : currentPlayer});
        }
    });

    // Handle player move
    socket.on('makeMove', (i, j) => {
      const updatedGameStatei = i; // Example function to process move
      const updatedGameStatej = j; // Example function to process move

      // Emit updated game state to both players
      io.emit('gameStateUpdated', updatedGameStatei, updatedGameStatej);
    });
    // When a user disconnects, update their online status to false
    socket.on('disconnect', () => {
        let userId = ""; // Implement this function to get userId from socket
        for (let [cUserId, socketId] of connectedUsers) {
            if (socketId === socket.id) {
                userId = cUserId;
            connectedUsers.delete(cUserId);
            break;
            }
        }
        User.findByIdAndUpdate(userId, { online: false }, { new: true })
        .then((user) => {
          console.log(`${user} disconnected`);
        })
        .catch((error) => {
          console.error('Error updating online status:', error);
        });
    });

    // Other socket event handlers...
  });
}

module.exports = { handleSocketConnection };
