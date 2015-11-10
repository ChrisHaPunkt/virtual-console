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
            callback.onMessage('message', message);
        });
        socket.on('broadcast', function (message) {
            callback.onMessage('broadcast', message);
        });
    };

    // public interface
    return function (inCallback) {
        if (io !== 'undefined') {
            init(inCallback);
            return {
                sendData: function (type, data) {
                    socket.emit(type, data);
                }
            };
        } else {
            console.error('Please include socket.io client module. http://socket.io/download/');
            return null;
        }
    };

}());
