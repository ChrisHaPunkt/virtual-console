/**
 * Created by hannes on 10.11.2015.
 */

/**
 *
 * Initialize own Socket Server
 */

var network = require('../sources/serverNetwork.js');
var userManagement = require('../sources/UserManagement.js')();
var util = require('util');


var startNetworkServer = function (server) {
    network.init(server, {
        onNewClient: function (id) {
            util.log('www | a user id ' + id + ' connected');
            network.broadcastMessage('A new user joined us! ID: ' + id);
            network.sendToClient(id, 'message', 'Your Client ID is: ' + id);
        },
        onLogin: function (id, username, password) {
            // TODO check user with authenticator module and return result
            return true;
        },
        onDisconnect: function (id) {
            util.log('www | a user id ' + id + ' disconnected');
            network.broadcastMessage('A user left us! ID: ' + id);
        },
        onMessage: function (id, data) {

            util.log('www | a user id ' + id + ' sended a message: ' + data);
            network.broadcastMessage('User ID ' + id + ': ' + data);
            network.sendToFrontend('frontendData', data);
        }
    }).start();
};

// exports
module.exports = {
    startHandling: function (server) {
        startNetworkServer(server);
    }
};