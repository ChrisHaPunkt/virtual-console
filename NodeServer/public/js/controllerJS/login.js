/**
 * Created by dennis on 26.11.15.
 */


var socket = undefined;


sendLogin = function(){
    socket = cn(
        'http://127.0.0.1',
        5222,
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
            }
        }
    );
    socket.sendLogin();
};


window.onload = function() {
    document.getElementById("input-user").oninput = function() {
        var inLength = document.getElementById("input-user").value.length;
        if (inLength > 0)
            console.log();
    }
}