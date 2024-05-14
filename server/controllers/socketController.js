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

    socket.on('chatMessage', async ({ senderId, receiverId, message }) => {
      try {
        const newMessage = await chatController.saveMessage(senderId, receiverId, message);
        io.emit('chatMessageSend', newMessage); // Emit message to all connected sockets
      } catch (error) {
        console.error(error);
      }
    });
    // // voice chat message
    // socket.on('offer', offer => {
    //   // Broadcast offer to other clients
    //   console.log('Sending offer', offer);
    //   socket.broadcast.emit('offer', offer);
    // });
  
    // socket.on('answer', answer => {
    //   // Broadcast answer to other clients
    //   console.log('Sending answer', answer);
    //   socket.broadcast.emit('answer', answer);
    // });
  
    // socket.on('iceCandidate', iceCandidate => {
    //   // Broadcast ICE candidate to other clients
    //   console.log('Sending ICE candidate', iceCandidate);
    //   socket.broadcast.emit('iceCandidate', iceCandidate);
    // });
  
    // socket.on('stopVoiceChat', () => {
    //   // Handle stop voice chat
    //   console.log('Stopping voice chat');
    //   socket.broadcast.emit('stopVoiceChat');
    // });
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
