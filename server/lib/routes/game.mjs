import Game from '../models/game';
import User from '../models/user';
import ensureAuth from '../utils/ensure-auth';
import express from 'express';

const router = express.Router()
    .post('/', ensureAuth, (req, res, next) => {
        console.log('THIS IS GAME ROUTE POST req.body: ', req.body);
        modifyData(req.body);
        console.log('MOOOOOODDDDIFY DATA',modifyData(req.body));

        new Game(req.body).save()
            .then(game => {
                console.log('GAMMEEEEEE',game);
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
        console.log('game route /GET user: ', req.user);
        User.findById(req.user.id)
            .populate('gameLog')
            .select('gameLog')
            .lean()
            .then(user => res.send(user.gameLog))
            .catch(next);
    })
;

export default router;

function modifyData(game) {
    game.difficulty = game.difficulty.difficulty;
    const avgN = Math.floor(game.sequences.reduce((a,b) => a + b.nBack, 0) / game.sequences.length *100) / 100;
    game.avgN = avgN;
}