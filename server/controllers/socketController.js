// socketHandlers.js
const User = require('../models/user'); // Assuming User model is defined in a separate file

function getUserIdFromSocket(socket) {
    // Implement logic to extract user ID from socket
    // For example, if you're using socket authentication and passing user ID in headers:
    return socket.request.headers.userId;
  }
  const connectedUsers = new Map();
function handleSocketConnection(io) {
  io.on('connection', (socket) => {
    // When a user connects, update their online status to true
    socket.on('authenticate', (userId) => {
        console.log('Authentication', userId);
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
        console.log('Player joined:', userId, connectedUsers.size);

        // Check if another player is available to pair
        if (connectedUsers.size === 2) {
        const players = Array.from(connectedUsers.keys());
        const player1 = players[0];
        const player2 = players[1];
        console.log('Players:', player1, player2);
        io.to(player1).emit('startGame', { opponent: player2 });
        io.to(player2).emit('startGame', { opponent: player1 });
        }
    });

    // Handle player move
    socket.on('makeMove', (move) => {
        // Implement game logic to process the move
        // Update game state
        // Emit updated game state to both players
    });

    // socket.on('logout', () => {
    //     console.log('User logged out:',connectedUsers, socket.id);
    //     // Perform cleanup actions (e.g., remove user from game rooms)
    //     // Disconnect the socket
    //     socket.disconnect(true);
    //   });
    // When a user disconnects, update their online status to false
    socket.on('disconnect', () => {
        console.log('A user disconnected', socket.id);
        let userId = ""; // Implement this function to get userId from socket
        console.log('Authentication', connectedUsers);
        for (let [cUserId, socketId] of connectedUsers) {
            if (socketId === socket.id) {
                userId = cUserId;
                console.log('cUserId', cUserId, userId);
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
