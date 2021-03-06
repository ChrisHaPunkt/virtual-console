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
app.set("selectedGame", {uniqueName: "main_menu", namespace: null});
app.set("handlingDB", false);

var os = require('os');

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal && (address.address.indexOf("14") === 0 || address.address.indexOf("192"))) {

            addresses.push(address.address);
        }
    }
}
addresses.push(os.hostname());

config.localIps = addresses;
config.hostname = os.hostname();

app.set("serverConfig", config);

var types = GameHandler.TYPES;


/*Reinit Gmaes on
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
 GameHandler.addNewGame(new GameVO({
 type: types.internal,
 unique_name: "MatrixGame",
 displayName: "Matrix Game"
 }));

 GameHandler.updateGame(new GameVO({
 type: types.internal,
 unique_name: "3DGame",
 displayName: "ThreeD Game NEUER NAME"
 }), function (callback) {
 util.log("Update callback:" + callback);
 });
 /*
 GameHandler.remove("3DGame");

 GameHandler.addNewGame(new GameVO({
 type: types.internal,
 unique_name: "3DGame",
 displayName: "ThreeD Game"
 }));
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
app.set('gameRouteHandler', gameRoute);
app.use('/games', gameRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

setTimeout(function () {
    //util.log("System shutdown..");
    /*System.shutdown(function (stdout, stderr) {
     });*/

}, 5000);

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
util.log("serverConfig", app.get("serverConfig"));

module.exports = app;
