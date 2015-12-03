window.onload = function () {

    /**
     * Build up a connection to server
     */
    var socket = io.connect();

    /**
     * ID of the log containing DOM-Element
     * @type {string}
     */
    var logContainer = 'log';

    socket.on('connect', function () {
        socket.emit('frontendInit', 'hi');
    });

    socket.on('frontendConnection', function (data) {
        console.log("on.FrontendData: ", data);
        writeContent('conn', data + " " + socket.id);
    });
    socket.on('frontendMessage', function (controllerData) {
        console.log("on.FrontendMessage: ", controllerData);

        writeContent('client', controllerData.data.clientName + ': ' + controllerData.data.message);


        if (controllerData.type == "button") {

            var a = 200 * Math.random();
            var b = 200 * Math.random();
            var c = 200 * Math.random();

            GameHandler.adjustCubeSize(0, {x: a, y: b, z: c});
        }
    });

    // write to content
    var pageContent = document.getElementById(logContainer);
    var writeContent = function (type, msg) {
        if (typeof msg === 'string') {
            pageContent.innerHTML = '<p class="message"><span class="messageType">' + type + ': </span><span class="messageContent">' + msg + '</span></p>' + pageContent.innerHTML;
        }
    };

}();

