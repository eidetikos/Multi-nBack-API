import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import redirectHttp from './utils/redirect-http';
import errorHandler from './utils/error-handler';
import checkDb from './utils/check-connection';
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
import auth from './routes/auth';


// ### Used Routes ### //
app.use('/api/auth', auth);


// ### Catchers ### //
app.use(checkDb());
app.use(errorHandler());

export default app;