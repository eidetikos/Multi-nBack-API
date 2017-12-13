import Game from '../models/game';
import User from '../models/user';
import ensureAuth from '../utils/ensure-auth';
import express from 'express';

const router = express.Router()
    .post('/', ensureAuth, (req, res, next) => {
        Game.create(modifyData(req.body))
            .then(game => {
                console.log('GAMMEEEEEE',game); // leaving this in for now.
                return User.findByIdAndUpdate(
                    req.user.id, 
                    { $push: { gameLog: game._id } }, 
                    { new: true }
                )
                    .select('-hash')
                    .then(user => res.send({ game, user }));
            })
            .catch(next);
    })
    .get('/all', (req, res, next) => {
        Game.find()
            .then(games => res.send(games))
            .catch(next);
    })
    .get('/users', ensureAuth, (req, res, next) => {
        User.findById(req.user.id)
            .populate('gameLog')
            .select('gameLog')
            .lean()
            .then(user => res.send(user.gameLog))
            .catch(next);
    })
;

export default router;


// Helper function: 
// changes difficulty prop to display corresponding string instead of object
// Calculates avgN and highestN back, and sets their prop with the new calculated data
function modifyData(game) {

    const avgN = Math.floor(game.sequences.reduce((a,b) => a + b.nBack, 0) / game.sequences.length *100) / 100;
    const highN = game.sequences.sort((a,b) => b.nBack - a.nBack);
    
    game.avgN = avgN;
    game.highN = highN[0].nBack;

    return game;
}