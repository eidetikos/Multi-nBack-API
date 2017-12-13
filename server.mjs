import http from 'http';
import app from  './server/lib/app';
import connect from  './server/lib/utils/connect';

connect();

const server = http.createServer(app);
const port = process.env.PORT || 3001;

server.listen(port, () => {
    console.log('server is running on', server.address().port); // eslint-disable-line
});