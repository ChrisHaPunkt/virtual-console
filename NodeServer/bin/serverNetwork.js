/**
 * Created by hannes on 22.10.2015.
 * http://stackoverflow.com/a/13499302/2703106
 */

var io = require('socket.io').listen();
var server = 0;
var http = require('http');
var app = 0;
var port = 0;
var clients = [];
var msgCallback;

// start webserver and socket
var startListening = function() {
    // TODO dont create own http server, but use the one from /bin/www file
    server = http.createServer(app).listen(port, function () {
        console.log('serverNetwork | Server listening on port ' + port);
    });
    io.listen(server);

    io.sockets.on('connection', function(socket){
        // new client connects
        msgCallback.onMessage('connection', socket.id);
        clients.push(socket.id, {id:socket.id,socket:socket,loggedIn:false}); // add client to client list

        // client disconnects
        socket.on('disconnect', function(){
            msgCallback.onMessage('disconnect', socket.id);
            // TODO make this work
            clients.splice(clients.indexOf(socket.id),1); // remove client from client list
        });
    });
};

// messaging functions
var sendToClient = function(id,message){
    clients[id].socket.emit('message',message);
};
var broadcastMessage = function(message){
    if(typeof message === 'string'){
        io.emit('broadcast', message);
    }
};

// exports
module.exports = {
    init : function (inApp, inPort, callback) {
        app = inApp;
        port = inPort;
        msgCallback = callback;
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
    },
    getClientList : function () {
        return clients;
    },
    sendToClient : function (id,msg) {
        sendToClient(id,msg);
    },
    broadcastMessage : function(message){
        broadcastMessage(message);
    }
};
