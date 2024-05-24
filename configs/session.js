const { SessionOptions } = require('express-session');
const { IN_PROD } = require('./app');


const one_hr = 1000 * 60 * 60;

const {
    SESSION_SECRET = 'secret',
    SESSION_NAME = 'sid',
    SESSION_IDLE_TIMEOUT =  one_hr,
} = process.env;

const SESSION_OPTIONS = {
    secret: SESSION_SECRET,
    name: SESSION_NAME,
    cookie: {
        maxAge: parseInt(SESSION_IDLE_TIMEOUT),
        secure: IN_PROD,
        sameSite: true,
    },
    rolling: true,
    resave: false,
    saveUninitialized: true
};

exports.SESSION_OPTIONS = SESSION_OPTIONS;