/**
 * EXAMPLE FILE !!
 * Showing how to include and use client network
 */

window.onload = function () {
    var clientNetwork = cn({
        onMessage: function (type, msg) {
            // do anything you want with server messages
            writeContent(type + ' | ' + msg);
        }
    });

    var pageContent = document.getElementById('content');

    clientNetwork.sendData('message', 'hello from client');

    // write to content
    var writeContent = function (msg) {
        if (typeof msg === 'string') {
            pageContent.innerHTML += '<p class="message">' + msg + '</p>';
        }
    };
};