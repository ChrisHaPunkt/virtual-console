/**
 * Created by hannes on 25.10.2015.
 */

var cn = (function () {

    var socket;
    var callback;
    var serverUrl;
    var serverPort;

    // open socket and set listener
    var init = function (inServerUrl, inServerPort, inCallback) {

        // set config parameters
        callback = inCallback;
        serverUrl = inServerUrl;
        serverPort = inServerPort;

        // open socket connection
        socket = io.connect(serverUrl + ':' + serverPort);

        socket.on('message', function (message) {
            callback.onMessage(message.type, message.data);
        });
        socket.on('broadcast', function (message) {
            callback.onMessage(message.type, message.data);
        });
        socket.on('login', function (message) {
            callback.onLogin(message.result, message.username);
        });
        socket.on('anonymousLogin', function (message) {
            callback.onAnonymousLogin(message.result, message.username);
        });
        socket.on('register', function (message) {
            callback.onRegister(message.result, message.username);
        })
    };

    // public interface
    return function (inServerUrl, inServerPort, inCallback) {

        // check parameters
        if (typeof inServerUrl === 'undefined' || typeof inServerUrl !== 'string') {
            console.error('Server URL is not defined or no string.');
            return null;
        }
        if (typeof inServerPort === 'undefined' || typeof inServerPort !== 'number') {
            console.error('Server port is not defined or no number.');
            return null;
        }
        if (typeof inCallback === 'undefined' || typeof inCallback !== 'object') {
            console.error('Server callback is not defined or no object.');
            return null;
        }

        // check if socket io library exists
        if (io !== 'undefined') {
            init(inServerUrl, inServerPort, inCallback);
            return {
                sendData: function (type, data) {
                    socket.emit('message', {type: type, data: data});
                },
                sendLogin: function (username, password) {
                    socket.emit('login', {username: username, password: password});
                },
                sendAnonymousLogin: function () {
                    socket.emit('anonymousLogin');
                },
                register: function (username, password) {
                    socket.emit('register', {username: username, password: password});
                }
            };
        } else {
            console.error('Please include socket.io client module. src="/socket.io/socket.io.js"');
            return null;
        }
    };

}());
