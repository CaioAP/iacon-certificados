const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');

const env = require('subheaven-env');
env.addParams([
    { name: 'STORAGE_PATH', description: 'Caminho onde os arquivos serão armazenados.', required: true, sample: 'D:\\arquivos' },
    { name: 'SECRET', description: 'Chave usada para criptografia', required: true, sample: 'mysecret' }
]);
env.config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/iacon";
const mongoDB = process.env.MONGODB_URI || url;

mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro na Ligação ao MongoDB"));

const app = express();

app.use(cors({
    origin: [
        'http://localhost:2260',
        'http://127.0.0.1:2260',
        'http://200.233.132.162:2260',
        'http://192.168.254.216:2260',
        'http://191.33.229.42:2260'
    ]
}));
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.set('title', 'Iacon Documentos Usuários - Backend');

module.exports = app;