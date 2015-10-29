/**
 * Created by michaelschleiss on 29.10.15.
 */
$('.myButton').mousedown(buttonwaspressed);
$('.myButton').mouseup(buttonwasreleased);

var socket = cn({
    onMessage: function (type, msg) {
        // do anything you want with server messages
       console.log(msg);
    }
});


function buttonwaspressed(button){
    socket.sendData('message', $(this).attr('id') + 'ist gedrückt worden');
    console.log();
}

function buttonwasreleased(){
    console.log($(this).attr('id') + "ist losgelesassen worden");
}