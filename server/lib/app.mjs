import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import redirectHttp from './redirect-http';
import errorHandler from './error-handler';
import checkDb from './check-connection';
const app = express();

// ### Middleware ### //
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());


// ### Redirect http to https in production ### //
if(process.env.NODE_ENV === 'production') {
    app.use(redirectHttp());
}

// ### Required Routes ### //


// ### Used Routes ### //


// ### Catchers ### //
app.use(checkDb());
app.use(errorHandler());

export default app;