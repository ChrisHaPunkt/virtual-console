/**
 * Created by michaelschleiss on 29.10.15.
 */

define(['jquery', '../libs/jquery.mobile.custom.min'], function ($) {

    var socket;

    $(".myButton").on("vmousedown", function (event) {
        console.log(event, "vmousedown");
        buttonwaspressed(event.target);
    });
    $(".myButton").on("vmouseup", function (event) {
        console.log(event, "vmouseup");
        buttonwasreleased(event.target);
    });
    /*
    $(".myButton").on("tap", function (event) {
        console.log(event, "tap");
        buttonwaspressed(event.target);
        buttonwasreleased(event.target);
    });
*/
    function buttonwaspressed(button) {

        socket.sendData('button', {
            buttonName: $(this).attr('id'), buttonState: 8,
            timestamp: Date.now()
        });
    }

    function buttonwasreleased() {
        socket.sendData('button', {
            buttonName: $(this).attr('id'), buttonState: 7,
            timestamp: Date.now()
        });
    }

    return {
        setSocket: function (_socket) {
            socket = _socket;
        }
    };
});
