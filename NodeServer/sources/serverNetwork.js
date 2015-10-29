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
var callback;

// start webserver and socket
var startListening = function () {
    // TODO dont create own http server, but use the one from /bin/www file
    try {

        io.listen(server);
        console.log('serverNetwork | Server listening on port ' +  server.address().port );

    } catch (e) {

    }


    io.sockets.on('connection', function (socket) {
        // new client connects
        addClient(socket);
        callback.onNewClient(socket.id);

        // client sends message
        socket.on('message', function (data) {
            callback.onMessage(socket.id, data);
        });

        // client disconnects
        socket.on('disconnect', function () {
            callback.onDisconnect(socket.id);
            deleteClient(socket.id);
        });
    });
};

// client handling functions
var addClient = function (socket) {
    clients[socket.id] = {id: socket.id, socket: socket, loggedIn: false};
    console.log('serverNetwork | added client with id ' + socket.id);
};
var getClient = function (id) {
    if (clients.hasOwnProperty(id)) {
        return clients[id];
    } else {
        console.error('serverNetwork | no client with id ' + id);
        return null;
    }
};
var deleteClient = function (id) {
    if (clients.hasOwnProperty(id)) {
        if (clients[id].socket.connected) {
            console.log('serverNetwork | closing socket to client with id ' + id);
            io.sockets.connected[id].disconnect();
        }
        delete clients[id];
        console.log('serverNetwork | deleted client with id ' + id);
    } else {
        console.error('serverNetwork | no client with id ' + id + '. Cannot delete');
    }
};

// messaging functions
var sendToClient = function (id, messageType, message) {
    if (clients.hasOwnProperty(id)) {
        clients[id].socket.emit(messageType, message);
    } else {
        console.error('serverNetwork | no client with id ' + id + '. Cannot send message');
    }
};
var broadcastMessage = function (message) {
    if (typeof message === 'string') {
        io.emit('broadcast', message);
    }
};

// exports
module.exports = {
    init: function (serverInstance, inCallback) {
        server = serverInstance;
        callback = inCallback;
        return this;
    },
    start: function () {
        if (server == 0) {
            console.error('serverNetwork | Please set app first.');
        } else if (callback == 0) {
            console.error('serverNetwork | Please set callback first.');
        } else {
            startListening();
            //console.log('serverNetwork | Server network module started.');
        }
        return this;
    },
    getClientList: function () {
        return clients;
    },
    disconnectClient: function (id) {
        deleteClient(id);
    },
    sendToClient: function (id, messageType, msg) {
        sendToClient(id, messageType, msg);
    },
    broadcastMessage: function (message) {
        broadcastMessage(message);
    }
};
