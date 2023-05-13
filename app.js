const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const useRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit')

// Global MIddlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 60 minutes
	max: 3, // Limit each IP to 100 requests per `window` (here, per 60 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many resquets from this IP, Please try again in an hour'
})

// Apply the rate limiting middleware to all requests
app.use('/api',limiter); // applied to all the routes starting with /api this applies to all apis we can set for specifics as well


// app.use(morgan('dev')); // to log which api is called and its related things like time status etc
app.use(express.json()); // middleware to read body data also called body parser
// app.use(express.static(`${__dirname}/public`));
// custom middleware
app.use((req, res, next) => {
  // middleware applies to every request whether it is get post put patch delete etc
  console.log('hello from middleware ...');
  // console.log(req.headers)
  next();
});

// Routes
app.use('/api/v1/tours', tourRouter); // this is called mounting of routers
app.use('/api/v1/users', useRouter);

// Handling unhandled routes
app.all('*', (req, res, next) => {
  // 1 way
  // res.status(404).send({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  // 2 way of error handling
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // whenever we write anything inside next it automatically calls error handling middleware ny its own

  // 3 way of error handling
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  next(err);
});

// error handling middleware
// this is way to handle error at one place
app.use(globalErrorHandler);

// Server
module.exports = app;
