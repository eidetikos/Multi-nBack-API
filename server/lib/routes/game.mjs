import Game from '../models/game';
import User from '../models/user';
import ensureAuth from '../utils/ensure-auth';
import express from 'express';

const router = express.Router()
    .post('/', ensureAuth, (req, res, next) => {
        Game.create(modifyData(req.body))
            .then(game => {
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
    // don't put "all", a GET to route "/games" means all the games 
    .get('/', (req, res, next) => {
        Game.find()
            .lean()
            .then(games => res.send(games))
            .catch(next);
    })
    // doesn't make sense, "/games/users" returns authed users game log???
    // probably should be moved to "/me/games"
    .get('/users', ensureAuth, (req, res, next) => {
        User.findById(req.user.id)
            .populate('gameLog')
            .select('gameLog')
            .lean()
            .then(user => res.send(user.gameLog))
            .catch(next);
    });

export default router;

// Move this to the Game model!

// Helper function: 
// changes difficulty prop to display corresponding string instead of object
// Calculates avgN and highestN back, and sets their prop with the new calculated data
function modifyData(game) {

    if(game.sequences.length === 1) return { 
        ...game,
        avgN: 0,
        highN: 0
    };

    const avgN = Math.floor(game.sequences.slice(0, -1).reduce((a,b) => a + b.nBack, 0) / (game.sequences.length - 1) *100) / 100;
    const highN = game.sequences.slice(0, -1).sort((a,b) => b.nBack - a.nBack)[0].nBack;

    return { ...game, avgN, highN };
}