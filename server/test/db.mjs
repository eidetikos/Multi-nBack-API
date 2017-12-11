import connect from '../lib/utils/connect';
import mongoose from 'mongoose';
const url = 'mongodb://localhost:27017/multi-nBack-test';

before(() => connect(url));
after(() => mongoose.connection.close());

export default {
    drop() {
        return mongoose.connection.dropDatabase();
    }
};