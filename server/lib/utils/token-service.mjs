import jwt from 'jsonwebtoken-promisified';
const appSecret = process.env.APP_SECRET || 'changeme';

export default {
    sign(user) {
        const payload = {
            id: user._id
        };

        return jwt.signAsync(payload, appSecret);
    },

    verify(token) {
        return jwt.verifyAsync(token, appSecret);
    }
};