import http from 'http';
import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);

import app from '../lib/app';

const server = http.createServer(app);
const request = chai.request(server);

after(() => server.close());

export default request;