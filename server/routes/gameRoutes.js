const express = require('express');
const { newGame, getGame } = require('../controllers/gameController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/game',protect, newGame)
router.route("/game/:id").get(protect, getGame);

module.exports = router