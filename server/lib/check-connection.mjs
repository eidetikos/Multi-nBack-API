import { connection } from 'mongoose';
const state = require('mongoose/lib/connectionstate');

export default function getCheckConnection() {
    return function checkConnection(req, res, next) {
        if(connection.readyState !== state.connected) {
            next({ error: 'database not available'});
        }
        else next();
    };
}