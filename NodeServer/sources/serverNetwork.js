/**
 * Created by hannes on 22.10.2015.
 * http://stackoverflow.com/a/13499302/2703106
 *
 * IMPORTANT: The server and client network communication defines an additional message type.
 * Calling the function exports.sendToClient() will always emit a socket event of type 'message',
 * but the data object contains the self defined message type which is passed to the function.
 * data:{type:'myType',data:/data in any form/}
 *
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
var debug = false;

// start webserver and socket
var startListening = function () {
    // TODO dont create own http server, but use the one from /bin/www file
    try {
        io.listen(server);
        util.log('serverNetwork | Server listening on port ' + server.address().port);
    } catch (e) {
        console.error(e);
    }


    io.sockets.on('connection', function (socket) {
        // new client connects
        addClient(socket);
        callback.onNewClient(socket.id);

        if(debug)util.log('serverNetwork | a user id ' + socket.id + ' connected');
        if(debug)exports.sendToClient(socket.id, 'welcome', 'Your Client ID is: ' + socket.id);

        // frontend connected
        socket.on('frontendInit', function (message) {
            frontent = socket;
            callback.onFrontendConnected();

            if(debug)util.log('serverNetwork | Frontend Connected!');
            if(debug)exports.sendToFrontend('welcome','Hello Frontend');
        });

        // frontend sends message
        socket.on('frontendMessage', function (message) {
            callback.onFrontendMessage(message.type, message.data);

            if(debug)util.log('serverNetwork | Frontend sended a message with type ' + message.type + ' : ' + message.data);
        });

        // client registers
        socket.on('register', function (message) {
            // call callback method get return value
            var registerResult = callback.onRegister(socket.id, message.username, message.password);
            // send register result back to client
            sendToClient(socket.id, 'register', registerResult);
        });

        // client login
        socket.on('login', function (message) {
            // call callback method and get return value
            var loginResult = callback.onLogin(socket.id, message.username, message.password);
            // send login result back to client
            sendToClient(socket.id, 'login', loginResult);
        });

        // client anonymous login
        socket.on('anonymousLogin', function () {
            // call callback method and get return value
            var loginResult = callback.onAnonymousLogin(socket.id);
            // send anonymous login result back to client
            sendToClient(socket.id, 'anonymousLogin', loginResult);
        });

        // client sends message
        socket.on('message', function (message) {
            // call callback method
            callback.onMessage(socket.id, message.type, message.data);

            if(debug)util.log('serverNetwork | a user id ' + socket.id + ' sended a message with type ' + message.type + ' : ' + message.data);
            if(debug)broadcastMessage({type: 'userMessage', data: 'User ID ' + socket.id + ': ' + message.data});
        });

        // client disconnects
        socket.on('disconnect', function () {
            callback.onDisconnect(socket.id);
            deleteClient(socket.id);

            if(debug)util.log('serverNetwork | a user id ' + socket.id + ' disconnected');
            if(debug)broadcastMessage({type: 'userDisconnected', data: 'A user left us! ID: ' + socket.id});
        });
    });
};

// client handling functions
var addClient = function (socket) {
    clients[socket.id] = {id: socket.id, socket: socket};
    if(debug)util.log('serverNetwork | added client with id ' + socket.id);
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
            if(debug)util.log('serverNetwork | closing socket to client with id ' + id);
            io.sockets.connected[id].disconnect();
        }
        delete clients[id];
        if(debug)util.log('serverNetwork | deleted client with id ' + id);
        return true;
    } else {
        console.error('serverNetwork | no client with id ' + id + '. Cannot delete');
        return false;
    }
};

// messaging functions
var sendToClient = function (id, socketEventType, message) {
    if (clients.hasOwnProperty(id)) {
        clients[id].socket.emit(socketEventType, message);
        return true;
    } else {
        console.error('serverNetwork | no client with id ' + id + '. Cannot send message');
        return false;
    }
};
var sendToFrontend = function (socketEventType, message) {
    if (frontent != 0) {
        frontent.emit(socketEventType, message);
        return true;
    } else {
        console.error('serverNetwork | no frontend connected. Cannot send message.');
        return false;
    }
};
var broadcastMessage = function (message) {
    if (typeof clients === "object" && clients.length > 0) {
        io.emit('broadcast', message);
        return true;
    } else {
        console.error('serverNetwork | no clients to broadcast to. You are alone.');
        return false;
    }
};

// export object
var exports = {
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
        if (typeof clients === "object" && clients.length > 0) {
            return clients;
        } else {
            return false;
        }
    },
    disconnectClient: function (id) {
        return deleteClient(id);
    },
    sendToClient: function (id, messageType, data) {
        return sendToClient(id, 'message', {type: messageType, data: data});
    },
    sendToFrontend: function (messageType, data) {
        return sendToFrontend('frontendMessage', {type: messageType, data: data});
    },
    broadcastMessage: function (messageType, data) {
        return broadcastMessage('broadcast', {type: messageType, data: data});
    }
};

// exporting the actual object
module.exports = exports;
