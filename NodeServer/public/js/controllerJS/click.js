/**
 * Created by michaelschleiss on 29.10.15.
 */

define(['jquery'], function($){

    var socket;

    $('.myButton').mousedown(buttonwaspressed);
    $('.myButton').mouseup(buttonwasreleased);

    function buttonwaspressed(button) {
        socket.sendData('button', {buttonName: $(this).attr('id'), buttonState: 8} );
    }

    function buttonwasreleased() {
        socket.sendData('button', {buttonName: $(this).attr('id'), buttonState: 7} );
    }

    return {
        setSocket : function (_socket) {
            console.log("socket set");
            socket = _socket;
        }
    };
});
