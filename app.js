'use strict';

var mongoClient = require('mongodb').MongoClient;
var express = require('express');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var config = require('./configs/config');
var constant = require('./configs/constant');
var engine = require('ejs-locals');
var session = require("express-session");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var logger = require('./libs/log');
var utils = require('./helpers/utils');

var app = express();
var http = require('http').Server(app);

const MONGO_DB_URL = 'mongodb://localhost:27017/memory';
const SESSION_NAME = 'EthereumTokenTool';
const SESSION_SECRET = '1234567890qwertuiopasdfghjklzxcvbnm';
const COOKIE_TIME = 6*60*60*1000;   // 6 hours
// Add middleware set up
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.engine('ejs', engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cors());
app.use(express.static(path.join(__dirname, "assets")));
app.use(cookieParser());
// Log request actions
app.use((req, res, next) => {
    _writeLog(req);
    next();
});
app.use(session({
    name: SESSION_NAME,
    secret: SESSION_SECRET,
    cookie: {
        expires: new Date(Date.now() + COOKIE_TIME),
        maxAge: COOKIE_TIME
    },
    saveUninitialized: true,
    resave: true
}));

// Add routes
app.use(require('./configs/routes'));
utils.global[constant.global.uploadDir] = path.join(__dirname, "assets/uploads/");

// connect to DB
mongoClient.connect(MONGO_DB_URL, function (err, db) {
    if (err) {
        return logger.error("Cannot connect to DB uri: " + MONGO_DB_URL);
    }

    utils.global[constant.global.db] = db;

    var UserModel = require('./models/user');
    UserModel.checkDefaultAdmin(function(err){
        if(err) {
            return logger.error("Cannot set default administrator");
        }

        http.listen(config.server_port, function () {
            logger.info('Listening on port ' + config.server_port + '...');
        });
    });

});

var _writeLog = function(req){
    try {
        var clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var url = utils.format('%s://%s:%d%s', req.protocol, req.hostname, this.port, req.originalUrl);
        var method = typeof (req.method) != 'undefined' ? req.method : null;

        if (clientIp) {
            logger.debug('IP ' + clientIp);
        }

        logger.debug(method + ' ' + url);

        if (method == 'POST') {
            logger.debug('DATA ' + JSON.stringify(req.body));
        }

    } catch (ex) {

    }
}