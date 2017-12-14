import User from '../models/user';
// import ensureAuth from '../utils/ensure-auth';
import express from 'express';

const router = express.Router()
    .get('/personal-stats', (req, res, next) => {
        const userstats = [
            User.usersSequencesCompleted(req.user.id),
            User.usersMaxN(req.user.id),
            User.usersTopScore(req.user.id)
        ];
        Promise.all(userstats)
            .then( ([
                [ { sequencesCompleted } ],
                [ { maxN } ],
                [ { topScore } ]
            ]) => res.send({
                sequencesCompleted,
                maxN,
                topScore
            }))
            .catch(next);
    })
;

export default router;