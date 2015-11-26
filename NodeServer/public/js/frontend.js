window.onload = function () {

    var serverUrl = 'http://149.222.137.126';
    var serverPort = '5222';

    var socket = io.connect();//serverUrl + ':' + serverPort);

    socket.on('connect',function(){
        socket.emit('frontendInit','hi');
    });

    socket.on('frontendData', function(data){
        console.log("on.FrontendData: ",data);
        writeContent('client ' + data.clientId + ': ' + data.message);
    });
    socket.on('frontendMessage', function(data){
        console.log("on.FrontendMessage: ",data);
        writeContent('client ' + data.data.clientName + ': ' + data.data.message);
    });

    // write to content
    var pageContent = document.getElementById('content');
    var writeContent = function (msg) {
        if (typeof msg === 'string') {
            pageContent.innerHTML = '<p class="message">' + msg + '</p>' + pageContent.innerHTML;
        }
    };

}();