//npm install socket.io express

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var client = require('./routes/client');
var controllerDemo = require('./routes/controllerDemo');

var app = express();

// getting network module and start it
var network = require('./bin/serverNetwork');
network.init(app, 5225, {
    onNewClient: function (id) {
        console.log('app.js | a user id ' + id + ' connected');
        network.broadcastMessage('A new user joined us! ID: ' + id);
        network.sendToClient(id, 'message', 'Your Client ID is: ' + id);
    },
    onDisconnect: function (id) {
        console.log('app.js | a user id ' + id + ' disconnected');
        network.broadcastMessage('A user left us! ID: ' + id);
    },
    onMessage: function (id, data) {
        console.log('app.js | a user id ' + id + ' sended a message: ' + data);
        network.broadcastMessage('User ID ' + id + ': ' + data);
    }
}).start();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/client', client);
app.use('/controller', controllerDemo);

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


module.exports = app;
