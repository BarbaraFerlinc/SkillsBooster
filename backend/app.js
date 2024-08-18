const express = require("express");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

var companyRouter = require('./routes/companyRouter');
var domainRouter = require('./routes/domainRouter');
var questionRouter = require('./routes/questionRouter');
var quizRouter = require('./routes/quizRouter');
var userRouter = require('./routes/userRouter');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.ACCESS_CORS);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/company/', companyRouter);
app.use('/domain/', domainRouter);
app.use('/question/', questionRouter);
app.use('/quiz/', quizRouter);
app.use('/user/', userRouter);
/*
app.listen(process.env.PORT || 9001, () => {
  console.log("Server on port " + 9001);
});*/

module.exports = app;