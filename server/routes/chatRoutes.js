const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();


router.route("/allChats/:userid").get(chatController.getAllMessages);
router.route("/chats/:userid/:oppUserId").get(chatController.getMessages);

module.exports = router