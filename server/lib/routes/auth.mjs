import User from '../models/user';
import tokenService from '../utils/token-service';
import ensureAuth from '../utils/ensure-auth';
import express from 'express';
const router = express.Router();

function hasRequiredFields(req, res, next) {
    const user = req.body;

    if(!user || !user.password) {
        return next({
            code: 400,
            error: 'Name and password are required'
        });
    }
    next();
}

router
    .get('/verify', ensureAuth, (req, res) => {
        res.send({ verified: true });
    })

    .post('/signup', hasRequiredFields, (req, res, next) => {
        const { name, password } = req.body;
        delete req.body.password;

        User.exists({ name })
            .then(exists => {
                if(exists) { throw { code: 400, error: 'Name has already been taken' }; }
                const user = new User({ name });
                user.generateHash(password);
                return user.save();
            })
            .then(user => {
                return tokenService.sign(user)
                    .then(token => {
                        user.hash = null;
                        res.send({ token, user });
                    });
            })
            .catch(next);
    })

    .post('/signin', hasRequiredFields, (req, res, next) => {
        const { name, password } = req.body;
        delete req.body.password;

        User.findOne({ name })
            .then(user => {
                if(!user || !user.comparePassword(password)) {
                    throw { code: 401, error: 'Invalid Login' };
                }
                return user;
            })
            .then(user => {
                return tokenService.sign(user)
                    .then(token => {
                        user.hash = null;
                        res.send({ token, user });
                    });
            })
            .catch(next);
    });
    
export default router;
