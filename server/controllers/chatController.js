const ChatMessage = require('../models/chat');

// Controller function to save a new chat message
const saveMessage = async (senderId, receiverId, message) => {
  try {
    const newMessage = new ChatMessage({
      senderId,
      receiverId,
      message
    });
    await newMessage.save();
    return newMessage;
  } catch (error) {
    throw new Error('Error saving chat message:', error);
  }
};

// Controller function to get all chat messages between two users
const getMessages = async (req, res) => {
const userId = req?.params?.userid;
const oppUserId = req.params.oppUserId;

ChatMessage.find({
    $or: [
        { senderId: userId, receiverId: oppUserId },
        { senderId: oppUserId, receiverId: userId }
    ]
})
.populate('senderId', '-password') // Populate the 'user' field to get the user's details
.populate('receiverId', '-password') // Populate the 'user' field to get the user's details
.exec()
.then(chats => {
    console.log(chats, "chatststtsts", req.params.userid)
    res.json(chats);
})
.catch(err => {
    console.error('Error fetching Chats:', err);
    res.status(500).json({ error: 'Internal server error' });
});
//   try {
//     const messages = await ChatMessage.find({
//       $or: [
//         { senderId, receiverId },
//         { senderId: receiverId, receiverId: senderId }
//       ]
//     }).sort({ createdAt: 1 }); // Sort messages by createdAt in ascending order
//     return messages;
//   } catch (error) {
//     throw new Error('Error getting chat messages:', error);
//   }
};
const getAllMessages = async (req, res) => {
const userId = req?.params?.userid;

ChatMessage.find({
    $or: [
      { senderId: userId },
      { receiverId: userId }
    ]
})
.populate('senderId', '-password') // Populate the 'user' field to get the user's details
.populate('receiverId', '-password') // Populate the 'user' field to get the user's details
.exec()
.then(chats => {
    console.log(chats, "chatststtsts", req.params.userid)
    res.json(chats);
})
.catch(err => {
    console.error('Error fetching Chats:', err);
    res.status(500).json({ error: 'Internal server error' });
});
//   try {
//     const messages = await ChatMessage.find({
//       $or: [
//         { senderId, receiverId },
//         { senderId: receiverId, receiverId: senderId }
//       ]
//     }).sort({ createdAt: 1 }); // Sort messages by createdAt in ascending order
//     return messages;
//   } catch (error) {
//     throw new Error('Error getting chat messages:', error);
//   }
};
module.exports ={ saveMessage, getMessages, getAllMessages }