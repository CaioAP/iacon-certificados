const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');

require('dotenv').config();

process.env.OPENSSL_CONF = path.join(__dirname, 'openssl', 'windows', 'openssl.cnf');
process.env.OPENSSL_PATH = path.join(__dirname, 'openssl', 'windows', 'openssl.exe');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const certificatesRouter = require('./routes/certificates');

const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URI || url;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro na conexão com o MongoDB'));

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:1010',
      'http://127.0.0.1:1010',
      'http://200.233.132.162:1010',
      'http://192.168.254.216:1010',
      'http://191.33.229.42:1010'
    ]
  }
));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const isPathUnprotected = (path) => {
  const unprotected = [
    '/users/auth',
    '/users/insert'
  ];

  return unprotected.includes(path);
}

const cleanToken = (token) => {
  if (token.indexOf('Bearer') > -1) {
    return token.replace('Bearer ', '');
  }

  return token;
}

const validateUser = (req, res, next) => {
  if (isPathUnprotected(req.path))
    return next();

  const token = cleanToken(req.headers.authorization);
  if (!token) return res.status(401).send({ message: 'No token provided' });

  jwt.verify(token.replace('Bearer ', ''), process.env.SECRET, (error, decoded) => {
    if (error) return res.status(401).send({ message: 'Token outdated' });

    next();
  })
}

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : './temp/'
}));

app.use(validateUser);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/certificates', certificatesRouter);
app.set('title', 'Iacon Certificados - Backend');

module.exports = app;