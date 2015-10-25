/**
 * Created by hannes on 25.10.2015.
 */

var cn = (function () {

    var socket;
    var msgCallback;

    // open socket and set listener
    var init = function (callback) {

        socket = io();
        msgCallback = callback;

        socket.on('message', function (message) {
            msgCallback.onMessage('message', message);
        });
        socket.on('broadcast', function (message) {
            msgCallback.onMessage('broadcast', message);
        });
    };

    // public interface
    return function (msgCallback) {
        if (io !== 'undefined') {
            init(msgCallback);
        } else {
            console.error('Please include socket.io client module. http://socket.io/download/');
        }
    };

}());
