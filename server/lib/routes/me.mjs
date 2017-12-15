import User from '../models/user';
import ensureAuth from '../utils/ensure-auth';
import express from 'express';
const router = express.Router();


router
    .get('/', ensureAuth, (req, res, next) => {
        User.findById(req.user.id)
            .select('-hash')
            .lean()
            .then(user => {
                res.send(user);
            })
            .catch(next);
    });

export default router;
