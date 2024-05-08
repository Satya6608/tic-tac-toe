const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    history: {
        type: Array,
        required: true
    }, 
    opponent: {
        type: String,
        required: true
    }, 
    winner: {
        type: String,
        required: true
    },
},{
    timestamps: true,
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;