window.onload = function () {

    var serverUrl = 'http://127.0.0.1';
    var serverPort = '5222';

    var socket = io.connect(serverUrl + ':' + serverPort);

    socket.on('connect',function(){
        socket.emit('frontendInit','hi');
    });

    socket.on('frontendData', function(data){
        writeContent(data);
    });

    // write to content
    var pageContent = document.getElementById('content');
    var writeContent = function (msg) {
        if (typeof msg === 'string') {
            pageContent.innerHTML += '<p class="message">' + msg + '</p>';
        }
    };

}();