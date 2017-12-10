import http from 'http';
import app from  './server/lib/app';
import connect from  './server/lib/connect';

connect();

const server = http.createServer(app);
const port = process.env.PORT || 3001;

server.listen(port, () => {
    // eslint disable-next-line
    console.log('server is running on', server.address().port);
});