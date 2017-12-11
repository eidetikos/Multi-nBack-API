import request from './request';
import db from './db';
// import { request } from 'https';
import chai  from 'chai';

describe('Auth TESTS', () => {

    beforeEach(db.drop);

    let token = null;
    beforeEach(() => {
        return request  
            .post('/api/auth/signup')
            .send({ name: 'johnny', password: 'please' })
            .then(({ body }) => token = body.token);
    });

    it('tests signup', () => {
        chai.assert.ok(token);
    });
    
    it('returns error for name already in use', () => {
        return request
            .post('/api/auth/signup')
            .send({ name: 'johnny', password: 'please' })
            .then(() => { throw new Error('Name already in use'); },
                err => { chai.assert.equal(err.status, 400); });
    });
});
