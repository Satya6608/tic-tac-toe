// socketHandlers.js
const User = require('../models/user'); // Assuming User model is defined in a separate file
const ChatMessage = require('../models/chat');
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
      io.to(playersRoom).emit('gameStateUpdated', updatedGameStatei, updatedGameStatej);
    });

    socket.on('chatMessage', ({ senderId, receiverId, message }) => {
      // Save message to database
      console.log('Sending message', senderId, receiverId, message)
      const newMessage = new ChatMessage({
        senderId,
        receiverId,
        message
      });
      newMessage.save()
      .then(() => {
        io.emit('chatMessageSend', newMessage); // Emit message to the sender socket only
        })
        .catch((error) => {
          console.error('Error saving chat message:', error);
        });
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
