/**
 * Created by dennis on 26.11.15.
 */
define("jquery", [], function () {
    return jQuery.noConflict();
});

require(['click', 'clientNetwork', 'sensor', 'jquery'], function (click, cn, sensor, $) {

    var serverURL = "127.0.0.1";
    var serverPort = 5222;

    var socket = cn(serverURL, serverPort,
        {
            onMessage: function (type, msg) {
                // do anything you want with server messages
                console.log(type, msg);
            },
            onAnonymousLogin: function (result, username) {
                console.log(result, username);
            },
            onLogin: function (type, msg) {
                // do anything you want with server messages
                console.log(type, msg);
            },
            onRegister: function (type, msg) {
                // do anything you want with server messages
                console.log(type, msg);
            }
        }
    );

    // TODO proper login handling
    socket.sendAnonymousLogin();

    /*
    $.('#buttonContinue').click(function(){
    });
    var sendLogin = function () {
        socket.sendLogin();
    };
    */

    // passing socket instance to modules
    click.setSocket(socket);
    sensor.setSocket(socket);
});