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
import me from './routes/me';
import game from './routes/game';
import stats from './routes/stats';

// You want this one before the routes,
// otherwise they will run and the checkDb won't happen.
// Also, it usually only needs to be run in development mode:
if(process.env.NODE_ENV !== 'production') {
    app.use(checkDb());
}

// ### Used Routes ### //
app.use('/auth', auth);
app.use('/me', me);
app.use('/games', game);
app.use('/stats', stats);


// ### Catchers ### //
app.use(errorHandler());

export default app;