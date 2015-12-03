/**
 * Created by hannes on 22.10.2015.
 * http://stackoverflow.com/a/13499302/2703106
 */

var io = require('socket.io').listen();
var server = 0;
var http = require('http');
var app = 0;
var port = 0;
var clients = {};
var frontent = 0;
var callback;
var util = require('util');

// start webserver and socket
var startListening = function () {
    // TODO dont create own http server, but use the one from /bin/www file
    try {

        io.listen(server);
        util.log('serverNetwork | Server listening on port ' + server.address().port);

    } catch (e) {

    }


    io.sockets.on('connection', function (socket) {
        // new client connects
        addClient(socket);
        callback.onNewClient(socket.id);

        util.log('serverNetwork | a user id ' + socket.id + ' connected');
        sendToClient(socket.id, 'message', {type: 'welcome', data: 'Your Client ID is: ' + socket.id});

        // frontend connected
        socket.on('frontendInit', function (message) {
            frontent = socket;
            util.log('serverNetwork | Frontend Connected! | Msg: ' + message.msg);
            // TODO set Controller Template
            // mesage.controllerTemplate
            sendToFrontend('frontendConnection', 'hello frontend');
        });

        // frontend sends message
        socket.on('frontendOutboundMessage', function (message) {
            // TODO implement
        });

        // client registers
        socket.on('register', function (message) {
            var registerResult = callback.onRegister(socket.id, message.username, message.password);
            sendToClient(socket.id, 'register', registerResult);
        });

        // client login
        socket.on('login', function (message) {
            // call callback method and parse return value
            var loginResult = callback.onLogin(socket.id, message.username, message.password);
            // send authentication result back to client
            sendToClient(socket.id, 'login', loginResult);
        });

        // client anonymous login
        socket.on('anonymousLogin', function () {
            var loginResult = callback.onAnonymousLogin(socket.id);
            sendToClient(socket.id, 'anonymousLogin', loginResult);
        });

        // client sends message
        socket.on('message', function (message) {
            callback.onMessage(socket.id, message.type, message.data);

            util.log('serverNetwork | a user id ' + socket.id + ' sended a message with type ' + message.type + ' : ' + message.data);
            broadcastMessage({type: 'userMessage', data: 'User ID ' + socket.id + ': ' + message.data});
        });

        // client disconnects
        socket.on('disconnect', function () {
            callback.onDisconnect(socket.id);
            deleteClient(socket.id);

            util.log('serverNetwork | a user id ' + socket.id + ' disconnected');
            broadcastMessage({type: 'userDisconnected', data: 'A user left us! ID: ' + socket.id});
        });
    });
};

// client handling functions
var addClient = function (socket) {
    clients[socket.id] = {id: socket.id, socket: socket};
    util.log('serverNetwork | added client with id ' + socket.id);
};
var getClient = function (id) {
    if (clients.hasOwnProperty(id)) {
        return clients[id];
    } else {
        util.error('serverNetwork | no client with id ' + id);
        return null;
    }
};
var deleteClient = function (id) {
    if (clients.hasOwnProperty(id)) {
        if (clients[id].socket.connected) {
            util.log('serverNetwork | closing socket to client with id ' + id);
            io.sockets.connected[id].disconnect();
        }
        delete clients[id];
        util.log('serverNetwork | deleted client with id ' + id);
    } else {
        util.error('serverNetwork | no client with id ' + id + '. Cannot delete');
    }
};

// messaging functions
var sendToClient = function (id, socketEventType, message) {
    if (clients.hasOwnProperty(id)) {
        clients[id].socket.emit(socketEventType, message);
    } else {
        util.error('serverNetwork | no client with id ' + id + '. Cannot send message');
    }
};
var sendToFrontend = function (socketEventType, message) {
    if (frontent != 0) {
        util.log("serverNetwork: ",socketEventType, " -> ", message);
        frontent.emit(socketEventType, message);
    }
};
var broadcastMessage = function (message) {
    io.emit('broadcast', message);
};

// exports
module.exports = {
    init: function (inServer, inCallback) {
        server = inServer;
        callback = inCallback;
        return this;
    },
    start: function () {
        if (server == 0) {
            util.error('serverNetwork | Please set app first.');
        } else if (callback == 0) {
            util.error('serverNetwork | Please set callback first.');
        } else {
            startListening();
            //util.log('serverNetwork | Server network module started.');
        }
        return this;
    },
    getClientList: function () {
        return clients;
    },
    disconnectClient: function (id) {
        deleteClient(id);
    },
    sendToClient: function (id, messageType, data) {
        sendToClient(id, 'message', {type: messageType, data: data});
    },
    sendToFrontend: function (messageType, data) {
        sendToFrontend('frontendInboundMessage', {type: messageType, data: data});
    },
    broadcastMessage: function (messageType, data) {
        broadcastMessage('broadcast', {type: messageType, data: data});
    }
};
