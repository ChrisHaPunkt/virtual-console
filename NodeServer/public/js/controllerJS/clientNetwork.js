/**
 * Created by hannes on 25.10.2015.
 */

define(['/socket.io/socket.io.js'], function(io) {

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
            socket = io.connect();//serverUrl + ':' + serverPort);

            socket.on('message', function (message) {
                callback.onMessage(message.type, message.data);
            });
            socket.on('broadcast', function (message) {
                callback.onMessage(message.type, message.data);
            });
            socket.on('login', function (message) {
                callback.onLogin(message);
            });
            socket.on('anonymousLogin', function (message) {
                callback.onAnonymousLogin(message);
            });
            socket.on('register', function (message) {
                callback.onRegister(message);
            })
        };

        // public interface
        return function (inServerUrl, inServerPort, inCallback) {

            // check parameters
            if (typeof inCallback === 'undefined' || typeof inCallback !== 'object') {
                console.error('Server callback is not defined or no object.');
                return null;
            }
            if (typeof inServerPort === 'undefined' || typeof inServerPort !== 'number') {
                console.error('Server port is not defined or no number.');
                return null;
            }
            if (typeof inServerUrl === 'undefined' || typeof inServerUrl !== 'string') {
                console.error('Server URL is not defined or no string.');
                return null;
            }

            // check if socket io library exists
            if (io !== 'undefined') {
                init(inServerUrl, inServerPort, inCallback);
                return {
                    sendData: function (type, data, response) {

                        // check parameters
                        if (typeof data === 'undefined') {
                            console.error('sendData(type,data) | data is not defined or no string.');
                            return null;
                        }
                        if (typeof type === 'undefined' || typeof type !== 'string') {
                            console.error('sendData(type,data) | type is not defined or no string.');
                            return null;
                        }

                        // send message
                        
                        socket.emit('message', {type: type, data: data}, response);
                    },
                    sendLogin: function (username, password) {
                        socket.emit('login', {username: username, password: password});
                    },
                    sendAnonymousLogin: function () {
                        socket.emit('anonymousLogin');
                    },
                    sendRegister: function (username, password) {
                        socket.emit('register', {username: username, password: password});
                    }
                };
            } else {
                console.error('Please include socket.io client module. src="/socket.io/socket.io.js"');
                return null;
            }
        };

    }());
    return cn;
});