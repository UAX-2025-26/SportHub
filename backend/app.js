var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var cors = require('cors');
var rateLimit = require('express-rate-limit');
require('dotenv').config();

var indexRouter = require('./routes/index');

var app = express();

// security & utils
app.use(helmet());
var corsOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*';
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120
});
app.use(limiter);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/api', require('./routes/api/index'));

// health
app.get('/health', (req, res) => res.json({ ok: true }));

// 404 handler API only
app.use(function(req, res, next) {
  return res.status(404).json({ error: 'Not Found' });
});

// error handler JSON only
app.use(function(err, req, res, next) {
  const status = err && err.status ? err.status : 500;
  res.status(status).json({ error: err && err.message ? err.message : 'Server error' });
});

module.exports = app;
