import Game from '../models/game';
import User from '../models/user';
import ensureAuth from '../utils/ensure-auth';
import express from 'express';

const router = express.Router()
    .post('/', ensureAuth, (req, res, next) => {
        console.log(req.body);
        req.body.difficulty = req.body.difficulty.difficulty;
        new Game(req.body).save()
            .then(game => {
                return User.findByIdAndUpdate(
                    req.user.id, 
                    { $push: { gameLog: game._id } }, 
                    { new: true }
                )
                    .then(user => {
                        res.send({ game, user });
                    });
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

// function modifyData()