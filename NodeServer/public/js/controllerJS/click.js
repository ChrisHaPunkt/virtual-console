/**
 * Created by michaelschleiss on 29.10.15.
 */
$('.myButton').mousedown(buttonwaspressed);
$('.myButton').mouseup(buttonwasreleased);

var socket = cn({
    onMessage: function (type, msg) {
        // do anything you want with server messages
    },
    onLogin: function (message) {
        console.log('login result from sever ' , message);
    }
});

socket.sendAnonymousLogin();

function buttonwaspressed(button){
    socket.sendData($(this).attr('id') + 'ist gedrückt worden');
}

function buttonwasreleased(){
    socket.sendData($(this).attr('id') + "ist losgelesassen worden");
}