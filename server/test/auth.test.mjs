import request from './request';
import db from './db';
import chai  from 'chai';

describe('Auth TESTS', () => {

    beforeEach(db.drop);

    let token = null;

    beforeEach(() => {
        return request  
            .post('/auth/signup')
            .send({ name: 'johnny', password: 'please' })
            .then(({ body }) => token = body.token);
    });

    it('tests signup', () => {
        chai.assert.ok(token);
    });
    
    it('returns error for name already in use', () => {
        return request
            .post('/auth/signup')
            .send({ name: 'johnny', password: 'please' })
            .then(
                () => { throw new Error('Unexpected successful response, expected 400 Bad Request'); },
                err => chai.assert.equal(err.status, 400)
            );
    });

    it('tests signin with same credentials', () => {
        return request
            .post('/auth/signin')
            .send({ name: 'johnny', password: 'please' })
            .then(({ body }) => {
                chai.assert.isOk(body.token);
            });
    });

    it('rejects with a bad password', () => {
        return request
            .post('/auth/signin')
            .send({ name: 'johnny', password: 'baaad' })
            .then(
                () => { throw new Error('Unexpected successful response'); },
                err => chai.assert.equal(err.status, 401)
            );
    });

    it('verify token', () => {
        return request
            .get('/auth/verify')
            .set('Authorization', token);
        // this doesn't add anything, just return the promise
        // .then(() => chai.assert.ok(1));
    });
    
    // this test doesn't make any sense, not testing anything that wasn't covered in prior test.
    // There's no id on response or on token
    // it('gets a user by id', () => {
    //     return request
    //         .get('/auth/verify')
    //         .set('Authorization', token)
    //         .then(({ body }) => {
    //             chai.assert.equal(body._id, token.id);
    //         });
    // });
});
