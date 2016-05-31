/**
 * Created by michaelschleiss on 29.10.15.
 */

define(['jquery', '../libs/jquery.mobile.custom.min'], function ($) {

    var socket;

    $(".myButton").on("vmousedown", function (event) {

        buttonwaspressed(event.currentTarget);
    });
    $(".myButton").on("vmouseup", function (event) {
        buttonwasreleased(event.currentTarget);
    });
    /*
    $(".myButton").on("tap", function (event) {
        console.log(event, "tap");
        buttonwaspressed(event.target);
        buttonwasreleased(event.target);
    });
*/
    function buttonwaspressed(button) {
        console.log(button)
        socket.sendData('button', {
            buttonName: $(button).attr('id'), buttonState: 8,
            timestamp: Date.now()
        });
    }

    function buttonwasreleased(button) {
        console.log(button)
        socket.sendData('button', {
            buttonName: $(button).attr('id'), buttonState: 7,
            timestamp: Date.now()
        });
    }

    return {
        setSocket: function (_socket) {
            socket = _socket;
        }
    };
});
