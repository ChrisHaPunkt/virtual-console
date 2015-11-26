/**
 * Created by michaelschleiss on 29.10.15.
 */
$('.myButton').mousedown(buttonwaspressed);
$('.myButton').mouseup(buttonwasreleased);

var socket = cn(
    'http://127.0.0.1',
    5222,
    {
        onMessage: function (type, msg) {
            // do anything you want with server messages
            console.log(type, msg);
        },
        onAnonymousLogin: function (result, username) {
            console.log(result, username);
        }
    }
);

socket.sendAnonymousLogin();

function buttonwaspressed(button) {
    socket.sendData('button', $(this).attr('id') + 'ist gedrückt worden');
}

function buttonwasreleased() {
    socket.sendData('button', $(this).attr('id') + "ist losgelesassen worden");
}