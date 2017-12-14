// import Game from '../models/game';
import User from '../models/user';
import userstats from './userstats';
import ensureAuth from '../utils/ensure-auth';
import express from 'express';

const router = express.Router()
    .use('/users', ensureAuth, userstats)
    .get('/most-sequences-by-user', (req, res, next) => {
        User.mostSequencesByUser()
            .then( data => res.send(data))
            .catch(next);
    })
    .get('/highest-n-per-difficulty', (req, res, next) => {
        User.highestNBackPerDifficulty()
            .then( data => res.send(data))
            .catch(next);
    })
    .get('/top-scores-per-difficulty', (req, res, next) => {
        User.topScoresPerDifficulty()
            .then( data => res.send(data))
            .catch(next);
    })
;

export default router;