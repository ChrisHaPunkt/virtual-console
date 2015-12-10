/**
 * Created by hannes on 03.12.2015.
 */

define(['/socket.io/socket.io.js'], function (io) {
    var socket;
    var callback;

    /**
     * MAIN FUNCTION TO START NETWORK
     * */
    var startNetwork = function() {

        // open socket connection to server
        socket = io.connect();

        // send init message to server if connection was established successfully
        socket.on('connect', function () {
            socket.emit('frontendInit', 'hi');
        });
        // incoming message
        socket.on('frontendMessage', function (data) {
            callback.onMessage(data);
        });

    };

    /**
     * INTERNAL MESSAGIN FUNCTIONS
     * */
    // TODO implement frontendToClient and frontendBroadcast on server side
    var sendToClient = function(userName,messageType,message){
        socket.emit('frontendToClient',{userName:userName,messageType:messageType,message:message});
    };
    var broadcastMessage = function(messageType,message){
        socket.emit('frontendBroadcast',{messageType:messageType,message:message});
    };

    /**
     * PUBLIC INTERFACE
     * */
    return {
        initNetwork:function(_callback){
            callback = _callback;
            return this;
        },
        start:function(){
            startNetwork();
        },
        sendToClient:function(userName,messageType,message){
            sendToClient(userName,messageType,message);
        },
        broadcastMessage:function(messageType,message){
            broadcastMessage(messageType,message);
        }
    }
});