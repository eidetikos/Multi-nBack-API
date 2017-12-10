import tokenService from './token-service';

export default function() {
    (req, res, next) => {
        const token = req.get('Authorization') || req.get('authorization');
        tokenService.verify(token)
            .then(payload => {
                req.user = payload;
                next();
            })
            .catch(() => {
                next({ code: 404, error: 'Not Authorized' });
            });
    };
}