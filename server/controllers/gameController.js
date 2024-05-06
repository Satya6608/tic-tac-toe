const Game = require("../models/game");

const newGame = async (req, res) => {
    try {
        const { user, history, opponent, winner } = req.body;

        const newGame = await Game.create({
            user: user,
            history: history,
            opponent: opponent,
            winner: winner
        });

        res.status(201).json({
            success: true,
            message: "Game created successfully",
            game: newGame
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getGame = async (req, res) => {
    const userId = req.params.id;
    Game.find({ user: userId })
    .populate('user', '-password') // Populate the 'user' field to get the user's details
    .exec()
    .then(games => {
        res.json(games);
    })
    .catch(err => {
        console.error('Error fetching games:', err);
        res.status(500).json({ error: 'Internal server error' });
    });
  }
module.exports = { newGame, getGame };