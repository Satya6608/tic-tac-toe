const express = require('express');
const { newGame, getGame } = require('../controllers/gameController');

const router = express.Router();

router.post('/game', newGame)
router.route("/game/:id").get(getGame);

module.exports = router