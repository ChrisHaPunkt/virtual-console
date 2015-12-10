/**
 * Created by michaelschleiss on 29.10.15.
 */

define(['jquery'], function($){

    $('.myButton').mousedown(buttonwaspressed);
    $('.myButton').mouseup(buttonwasreleased);


    socket.sendAnonymousLogin();

    function buttonwaspressed(button) {
        socket.sendData('button', {buttonName: $(this).attr('id'), buttonState: 8} );
    }

    function buttonwasreleased() {
        socket.sendData('button', {buttonName: $(this).attr('id'), buttonState: 7} );
    }
});
