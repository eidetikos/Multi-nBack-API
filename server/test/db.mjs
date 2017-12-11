import connect from '../lib/utils/connect';
import mongoose from 'mongoose';
const url = 'mongodb://localhost:27017/multi-nBack-test';

before(() => connect(url));
after(() => mongoose.connection.close());

export default {
    drop(connection) {
        return () => {
            return new Promise((resolve, reject) => {
                const drop = () => connection.db.dropDatabase((error, value) => {
                    error ? reject(error) : resolve(value);
                });
                if(connection.readyState === 1) drop();
                else connect.on('open', drop);
            });
        };
    }
};