const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const heroRouter = require('./routes/heroRoutes');
const abilityRouter = require('./routes/abilityRoutes');
const weaponRouter = require('./routes/weaponRoutes');
const characterRouter = require('./routes/characterRoutes');
const battleRouter = require('./routes/battleRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(helmet());
app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: ['level', 'name', 'firstName', 'createdAt', 'stat'],
  })
);

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);

app.use('/api/v1/heroes', heroRouter);
app.use('/api/v1/abilities', abilityRouter);
app.use('/api/v1/weapons', weaponRouter);
app.use('/api/v1/characters', characterRouter);
app.use('/api/v1/battle', battleRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

module.exports = app;
