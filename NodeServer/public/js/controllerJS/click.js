/**
 * Created by michaelschleiss on 29.10.15.
 */

define(['jquery', '../libs/jquery.mobile.custom.min'], function ($) {

    var socket;
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

    $(".myButton").on("vmousedown", function (event) {

        if (navigator.vibrate) {

            navigator.vibrate(100);
        }
        buttonwaspressed(event.currentTarget);
    })
        .on("vmouseup", function (event) {
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
