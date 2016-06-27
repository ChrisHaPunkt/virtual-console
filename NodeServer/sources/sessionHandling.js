/**
 * Created by hannes on 10.11.2015.
 */

var network = require('../sources/serverNetwork.js');
var userManagement = require('../sources/UserManagement.js')();
var GameHandler = require('../sources/Games');
var GameVO = require("../sources/ValueObjects/GameVO");
var system = require('../sources/System.js');
var app = require('../app');
var util = require('util');

var activeUsers = {};
var server = 0;
var userCallback = 0;
var currentAnonymousUserId = 0;

/**
 * FUNCTION TO START THE UNDERLYING SERVER-NETWORK
 * function is called via public start method. see module exports at the end of this file
 * */
var startNetworkServer = function (server) {
    network.init(server, {
        onNewClient: function (id, _callback) {
            addUser(id);
            _callback(true);
        },
        // incoming register request is passed down to userManagement and callback from network is called on result
        onRegister: function (id, username, password, _callback) {
            userManagement.registerUser(username, password, function (userManagementResult, msg) {

                if (userManagementResult) {
                    _callback({
                        result: userManagementResult,
                        username: username,
                        message: msg
                    });
                } else {
                    _callback({
                        result: userManagementResult,
                        username: username,
                        message: msg
                    });
                }
            });

        },
        // incoming login request is passed down to userManagement and callback from network is called on result
        onLogin: function (id, username, password, _callback) {
            userManagement.authenticateUser(username, password, function (userManagementResult, msg) {

                if (userManagementResult) {
                    setUserName(id, username);
                    setUserStatus(id, true, true);
                    userCallback.onNewUser(username);

                    _callback({
                        result: userManagementResult,
                        username: username,
                        message: msg
                    });
                } else {

                    _callback({
                        result: userManagementResult,
                        username: username,
                        message: msg
                    });
                }

            });
        },
        // incoming anonymousLogin request - a username is generated and returned
        onAnonymousLogin: function (id, _callback) {
            var tmpUserName = "User_" + ++currentAnonymousUserId;
            setUserName(id, tmpUserName);
            setUserStatus(id, true, false);
            userCallback.onNewUser(tmpUserName);

            _callback({
                result: true,
                username: tmpUserName
            });

        },
        onDisconnect: function (id, _callback) {
            userCallback.onUserDisconnects(getUserById(id).userName);
            removeUserById(id);
            _callback(true);
        },
        onMessage: function (id, type, data, _callback) {
            if (isLoggedIn(id)) {
                switch (type) {
                    case 'addNewGameDetails':
                        GameHandler.addNewGame(new GameVO({
                            type: GameHandler.TYPES.external,
                            unique_name: data.uname,
                            displayName: data.name,
                            contentUrl: data.url
                        }));
                        break;
                    default:
                }
                userCallback.onMessage(getUserById(id).userName, type, data);
                _callback(true);
            } else {
                _callback(false);
                util.error('sessionHandler | user id ' + id + ' send message without being authenticated.');
            }
        },
        onFrontendConnected: function () {
            userCallback.onFrontendConnected();

            // send logged in users to newly connected frontend
            for (var user in activeUsers) {
                if (!activeUsers.hasOwnProperty(user)) continue;
                var currentUserName = activeUsers[user].userName;
                if (currentUserName) {
                    userCallback.onNewUser(currentUserName);
                }
            }
        },
        // frontend sends message
        onFrontendOutboundMessage: function (type, message) {
            userCallback.onFrontendOutboundMessage(type, message);
        },
        // frontend sends data or data request
        onFrontendOutboundData: function (request, data, callbackFromClient) {
            switch (request) {
                case 'setControllerTemplate':
                    app.set('chosenControllerTemplate', data);
                    break;
                case 'setFrontendType':
                    app.set('frontendType', data);
                    break;
                case 'requestGameData':
                    if (data.game) {
                        // game has been specified
                        // TODO get singlle game data only
                    } else {
                        // all games are requested
                        callbackFromClient(app.get('fullQualifiedGameVOs'));
                    }
                    break;
                case 'restartServer':
                    setTimeout(function () {
                        // TODO restart server
                    }, data.delay);
                    callbackFromClient('Server restarting in ' + data.delay / 1000 + ' seconds!');
                    break;
                case 'shutdownServer':
                    setTimeout(function () {
                        system.shutdown();
                    }, data.delay);
                    callbackFromClient('Server shutting down in ' + data.delay / 1000 + ' seconds!');
                    break;
                case 'gameSelected':
                    app.set("selectedGame", data.gameUniqueName);
                    console.log('sessionHandling | current game running in frontend: ' + data.gameUniqueName);
                    break;
                case 'gameStarted':
                    callback.onGameStarted();
                    break;
                default:
                    console.log('sessionHandling | Unknown Data request from Server: ' + request + ' with data: ' + data);
            }
        }
    }).start();
};

/**
 * INTERNAL USER HANDLING FUNCTIONS
 * */
var addUser = function (id) {
    activeUsers[id] = {socketId: id, userName: 0, isLoggedIn: false, isAuthenticated: false};
};

var setUserName = function (id, userName) {
    activeUsers[id].userName = userName;
};
var setUserStatus = function (id, login, auth) {
    activeUsers[id].isLoggedIn = login;
    activeUsers[id].isAuthenticated = auth;
};

var isLoggedIn = function (id) {
    return activeUsers[id].isLoggedIn;
};

var removeUserByName = function (userName) {
    var tmpUserId = getUserIdByName(userName);
    if (tmpUserId) {
        removeUserById(tmpUserId);
    }
};
var removeUserById = function (id) {
    if (activeUsers.hasOwnProperty(id)) {
        delete activeUsers[id];
    }
};

var getUserById = function (id) {
    return activeUsers[id];
};
var getUserIdByName = function (userName) {
    for (var tmpUserId in activeUsers) {
        if (activeUsers.hasOwnProperty(tmpUserId)) {
            if (activeUsers[tmpUserId].userName === userName) {
                return tmpUserId;
            }
        }
    }
    return false;
};

/**
 * EXPORT OBJECT / PUBLIC INTERFACE
 * */
var exports = {
    init: function (inServer, inCallback) {
        server = inServer;
        userCallback = inCallback;
        return this;
    },
    start: function () {
        startNetworkServer(server);
        return this;
    },
    sendToUser: function (name, type, message) {
        network.sendToClient(getUserIdByName(name), type, message);
    },
    broadcastMessage: function (type, data) {
        network.broadcastMessage(type, data)
    },
    removeUser: function (name) {
        removeUserByName(name);
        network.disconnectClient(getUserIdByName(name));
    },
    setUserData: function (name, data) {
        //TODO set userdata in usermanagement
    },
    getUserData: function (name, data) {
        //TODO get userdata from usermanagement
    },
    sendToFrontend_Message: function (clientName, messageType, message) {
        network.sendToFrontend_Message(messageType, {clientName: clientName, message: message});
    },
    sendToFrontend_Data: function (type, msg) {
        network.sendToFrontend_Data({type: type, data: msg});
    }
};
// exporting the actual object
module.exports = exports;