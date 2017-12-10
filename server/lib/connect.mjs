/* eslint no-console: "off" */
import mongoose from 'mongoose';
import bluebird from 'bluebird';
mongoose.Promise = bluebird;
const defaultUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/multi-n-back';

export default function(dbUri = defaultUri) {
    
    const promise = mongoose.connect(dbUri, { useMongoClient: true });

    mongoose.connection.on('connected', () => { 
        console.log('Mongoose default connection open to ' + dbUri);
    });
    
    mongoose.connection.on('error', err => { 
        console.log('Mongoose default connection error: ' + err);
    }); 
    
    mongoose.connection.on('disconnected', () => { 
        console.log('Mongoose default connection disconnected'); 
    });
    
    process.on('SIGINT', () => {  
        mongoose.connection.close(() => {

            console.log( 'Mongoose default connection disconnected through app termination' ); 
            process.exit(0); 
        }); 
    });

    return promise;
}