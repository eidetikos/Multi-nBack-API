import  mongoose  from 'mongoose';
// console.log(mongoose.connection);
import state from 'mongoose/lib/connectionstate';

export default function getCheckConnection() {
    return function checkConnection(req, res, next) {
        if(mongoose.connection.readyState !== state.connected) {
            next({ error: 'database not available'});
        }
        else next();
    };
}