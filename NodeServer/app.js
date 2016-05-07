//npm install socket.io express

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var util = require('util');
var System = require('./sources/System');

var mainMenuRoute = require('./routes/mainMenuRoute');
var controllerRoutes = require('./routes/controllerRoute');
var gameRoute = require('./routes/gameRoute');
var config = require('../config.json');
var app = module.exports.app = express();
var debug = config.debug;

var GameHandler = require('./sources/Games');
var GameVO = require("./sources/ValueObjects/GameVO");

app.set("fullQualifiedGameVOs", false);

var types = GameHandler.TYPES;


GameHandler.addNewGame(new GameVO({
    type: types.external,
    unique_name: "ExternalGame",
    displayName: "Matrix Demo Game",
    contentUrl: "https://homeset.de/blog"
}));

GameHandler.addNewGame(new GameVO({
    type: types.internal,
    unique_name: "CarsGame",
    displayName: "Cars Demo Game"
}));

GameHandler.addNewGame(new GameVO({
    type: types.internal,
    unique_name: "3DGame",
    displayName: "ThreeD Game"
}));

GameHandler.addNewGame(new GameVO({
    type: types.internal,
    unique_name: "MatrixGame",
    displayName: "Matrix Game"
}));

/*
GameHandler.updateGame(new GameVO({
    type: types.internal,
    unique_name: "3DGame",
    displayName: "ThreeD Game NEUER NAME"
}), function (callback) {
    util.log("Update callback:" + callback);
});

GameHandler.remove("3DGame");

*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', controllerRoutes);
app.use('/menu', mainMenuRoute);
app.use('/games', gameRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

System.shutdown();

module.exports = app;
