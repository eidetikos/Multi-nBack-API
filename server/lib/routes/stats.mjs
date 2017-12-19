import User from '../models/user';
import ensureAuth from '../utils/ensure-auth';
import express from 'express';

const router = express.Router()
    .get('/community', (req, res, next) => {
        const communityStats = [
            User.mostSequencesByUser(),
            User.highestNBackPerDifficulty(),
            User.topScoresPerDifficulty()
        ];
        Promise.all(communityStats)
            .then( ([
                mostSequencesByUser,
                highestNBackPerDifficulty,
                topScoresPerDifficulty
            ]) => {
                res.send({
                    mostSequencesByUser,
                    highestNBackPerDifficulty: mapLeaderboardArrayToObject(highestNBackPerDifficulty),
                    topScoresPerDifficulty: mapLeaderboardArrayToObject(topScoresPerDifficulty)
                });
            })
            .catch(next);
    })
    // or move to "/me/stats"...
    .get('/me', ensureAuth, (req, res, next) => {
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
    });

export default router;

// I think you can do this with the aggregation pipeline
function mapLeaderboardArrayToObject(leaderboards) {
    const tempLeaderboards = [ ...leaderboards ];
    leaderboards = {};
    tempLeaderboards.forEach(ele => leaderboards[ele.difficulty] = ele.leaderboard);
    return leaderboards;
}