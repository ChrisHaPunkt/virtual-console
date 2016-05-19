/**
 * Created by michaelschleiss on 29.10.15.
 */

define(['jquery'], function ($) {

    var socket;

    $('.myButton')
        .mousedown(buttonwaspressed);

    $('.myButton')
        .mouseup(buttonwasreleased);


    function buttonwaspressed(button) {
        socket.sendData('button', {
            //buttonName: $(this).attr('id'), buttonState: 8,
            buttonName: 'RIGHT',
            timestamp: Date.now(),
            buttonState: 1 //0 = released 1=pressed
        });
    }


    function buttonwasreleased() {
        socket.sendData('button', {
            buttonName: 'RIGHT',
            timestamp: Date.now(),
            buttonState: 0 //0 = released
        });
    }

    return {
        setSocket: function (_socket) {
            socket = _socket;
        }
    };
});
