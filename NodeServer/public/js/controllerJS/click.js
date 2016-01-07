/**
 * Created by michaelschleiss on 29.10.15.
 */

define(['jquery'], function($){

    var socket;

    $('.myButton').mousedown(buttonwaspressed);
    $('.myButton').mouseup(buttonwasreleased);

    function buttonwaspressed(button) {
        socket.sendData('button', {buttonName: $(this).attr('id'), buttonState: 8,
            timestamp: Date.now()} );
    }

    function buttonwasreleased() {
        socket.sendData('button', {buttonName: $(this).attr('id'), buttonState: 7,
            timestamp: Date.now()} );
    }

    return {
        setSocket : function (_socket) {
            socket = _socket;
        }
    };
});
