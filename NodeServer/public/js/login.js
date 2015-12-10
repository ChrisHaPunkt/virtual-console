/**
 * Created by dennis on 26.11.15.
 */


var socket = undefined;
var serverURL = "127.0.0.1";
var serverPort = 5222;



var socket = cn(serverURL, serverPort, {
    onMessage: function (type, msg) {
        // do anything you want with server messages
        console.log(type, msg);
    },
    onAnonymousLogin: function (result, username) {
        console.log(result, username);
        if (result == true) {
            window.location.assign("/game");
        }
    },
    onLogin: function (type, msg) {
        // do anything you want with server messages
        console.log(type, msg);
    },
    onRegister: function (type, msg) {
        // do anything you want with server messages
        console.log(type, msg);
    }
});





/*
window.onload = function() {
    document.getElementById("input-user").oninput = function() {
        var inLength = document.getElementById("input-user").value.length;
        if (inLength > 0)
            console.log();
    }
};
*/