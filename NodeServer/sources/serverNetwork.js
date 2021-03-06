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
var frontend = 0;
var callback;
var util = require('util');
var config = require('../../config.json');
var debug = config.debug;

// start webserver and socket - function is called via public start method. see module exports at the end of this file
var startListening = function () {
    try {
        io.listen(server);
        if (debug) util.log('serverNetwork | Server listening on port ' + server.address().port);
    } catch (e) {
        console.error(e);
    }

    /**
     * SOCKET EVENT LISTENER
     * */
    io.sockets.on('connection', function (socket) {

        // new client connects
        addClient(socket);
        callback.onNewClient(socket.id, function (result) {
            // callback from session handling - not needed atm
        });
        if (debug)util.log('serverNetwork | a user id ' + socket.id + ' connected');
        if (debug)exports.sendToClient(socket.id, 'welcome', 'Your Client ID is: ' + socket.id);

        // frontend connected
        socket.on('frontendInit', function (message) {
            frontend = socket;
            callback.onFrontendConnected(function (result) {
                // callback from session handling - not needed atm
            });
            if (debug)util.log('serverNetwork | Frontend Connected!');
            // server -> frontend handshake
            exports.sendToFrontend_InitAck('Hello Frontend');
        });

        // frontend sends message
        socket.on('frontendOutboundMessage', function (message) {
            if (frontend != 0) {
                callback.onFrontendOutboundMessage(message.type, message.data, function (result) {
                    // callback from session handling - not needed atm
                });
                if (debug) util.log('serverNetwork | Frontend sent a message with type ' + message.type + ' : ' + message.data);
            } else {
                if (debug) util.log('serverNetwork | ERROR: Frontend sent a message without being initiated! (' + message.type + ' : ' + message.data + ')');
            }
        });

        // frontend sends data or data request
        socket.on('frontendOutboundData', function (data, callbackFromClient) {
            if (frontend != 0) {
                callback.onFrontendOutboundData(data.request, data.data, callbackFromClient);
                if (debug)util.log('serverNetwork | Frontend sent data with request ' + data.request + ' : ' + data.data);
            } else {
                if (debug) util.log('serverNetwork | ERROR: Frontend sent data without being initiated! (' + data.request + ' : ' + data.data + ')');
            }
        });

        // client registers
        socket.on('register', function (message) {
            callback.onRegister(socket.id, message.username, message.password, function (result) {
                if (debug)util.log('serverNetwork | Register result from sessionHandling', result);
                sendToClient(socket.id, 'register', result);
            });
        });

        // client login
        socket.on('login', function (message) {
            // call callback method and parse return value
            callback.onLogin(socket.id, message.username, message.password, function (result) {
                // send authentication result back to client
                sendToClient(socket.id, 'login', result);
            });
        });

        // client anonymous login
        socket.on('anonymousLogin', function () {
            // call callback method and get return value
            callback.onAnonymousLogin(socket.id, function (result) {
                // send anonymous login result back to client
                sendToClient(socket.id, 'anonymousLogin', result);
            });
        });

        // client sends message
        socket.on('message', function (message, _callbackFromEmit) {
            // call callback method
            callback.onMessage(socket.id, message.type, message.data, _callbackFromEmit, function (result) {
                // callback from session handling - not needed atm
            });
            if (debug)util.log('serverNetwork | a user id ' + socket.id + ' sent a message with type \'' + message.type + '\' : ' + JSON.stringify(message.data));
        });

        // client disconnects
        socket.on('disconnect', function () {
            callback.onDisconnect(socket.id, function (result) {
                // callback from session handling - not needed atm
            });
            deleteClient(socket.id);
            if (debug)util.log('serverNetwork | a user id ' + socket.id + ' disconnected');
        });
    });
};

/**
 * INTERNAL CLIENT HANDLING FUNCTIONS
 * */
var addClient = function (socket) {
    clients[socket.id] = {id: socket.id, socket: socket};
    if (debug)util.log('serverNetwork | added client with id ' + socket.id);
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
            if (debug)util.log('serverNetwork | closing socket to client with id ' + id);
            io.sockets.connected[id].disconnect();
        }
        delete clients[id];
        if (debug)util.log('serverNetwork | deleted client with id ' + id);
        return true;
    } else {
        console.error('serverNetwork | no client with id ' + id + '. Cannot delete');
        return false;
    }
};

/**
 * INTERNAL MESSAGING FUNCTIONS
 * */
// sends message to single client
var sendToClient = function (id, socketEventType, message) {
    if (clients.hasOwnProperty(id)) {
        clients[id].socket.emit(socketEventType, message);
        return true;
    } else {
        console.error('serverNetwork | no client with id ' + id + '. Cannot send message');
        return false;
    }
};
// sends a message to the frontend
// ONLY used by exported messaging functions (see below)
var sendToFrontend = function (socketEventType, message) {
    if (frontend != 0) {
        if (debug) util.log("SEND REBUILD", socketEventType, message);
        frontend.emit(socketEventType, message);
        return true;
    } else {
        console.error('serverNetwork | no frontend connected. Cannot send message.');
        return false;
    }
};
// broadcasts a message to all connected clients
var broadcastMessage = function (message) {
    if (typeof clients !== 'object') {
        console.error('Internal Error. Client store is no object.');
        return false;
    } else if (Object.keys(clients).length > 0) {
        io.emit('broadcast', message);
        return true;
    } else {
        console.error('serverNetwork | no clients to broadcast to. You are alone.');
        return false;
    }
};

/**
 * EXPORT OBJECT / PUBLIC INTERFACE
 * */
var exports = {
    // sets initial setting
    init: function (inServer, inCallback) {
        server = inServer;
        callback = inCallback;
        return this;
    },
    // starts the socket server
    start: function () {
        if (server == 0) {
            console.error('serverNetwork | Please set app first.');
        } else if (callback == 0) {
            console.error('serverNetwork | Please set callback first.');
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
    // normal frontend messaging function // this should be used by the game for controller to frontend messaging
    sendToFrontend_Message: function (messageType, data) {
        return sendToFrontend('frontendInboundMessage', {type: messageType, data: data});
    },
    // internal data function // DO NOT use for game development
    sendToFrontend_Data: function (data) {
        return sendToFrontend('frontendInboundData', data);
    },
    // only used for connection establishment
    sendToFrontend_InitAck: function (data) {
        return sendToFrontend('frontendInitAck', data);
    },
    broadcastMessage: function (messageType, data) {
        return broadcastMessage({type: messageType, data: data});
    }
};
// exporting the actual object
module.exports = exports;
