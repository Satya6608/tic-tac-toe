const express = require('express');
const gameController = require('../controllers/gameController');

const router = express.Router();

router.post('/game', gameController.newGame)
router.route("/game/:id").get(gameController.getGame);

module.exports = router