/**
 * Created by hannes on 22.10.2015.
 * http://stackoverflow.com/a/13499302/2703106
 */

"use strict";

var io = require('socket.io').listen();
var server = 0;
var http = require('http');
var app = 0;
var port = 0;

// start webserver and socket
var startListening = function() {
    server = http.createServer(app).listen(port, function () {
        console.log('serverNetwork | Server listening on port ' + port);
    });
    io.listen(server);

    io.set('transports', ['websocket', 'flashsocket']);

    io.sockets.on('connection', function(socket){
        console.log('serverNetwork | a user connected');
    });
};

// exports
module.exports = {
    init : function (inApp, inPort) {
        app = inApp;
        port = inPort;
        return this;
    },
    start : function(){
        if(app != 0){
            startListening();
            //console.log('serverNetwork | Server network module started.');
        }else{
            console.error('serverNetwork | Please set app first.');
        }
        return this;
    }
};
