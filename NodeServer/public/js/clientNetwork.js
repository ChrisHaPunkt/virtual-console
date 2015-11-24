/**
 * Created by hannes on 25.10.2015.
 */

var cn = (function () {

    var socket;
    var callback;

    // open socket and set listener
    var init = function (inCallback) {

        socket = io();
        callback = inCallback;

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
    return function (inCallback) {
        if (io !== 'undefined') {
            init(inCallback);
            return {
                sendData: function (type, data) {
                    socket.emit('message', {type:type, data:data});
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
            console.error('Please include socket.io client module. http://socket.io/download/');
            return null;
        }
    };

}());
