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
        var a = 1*Math.random();
        var b = 1*Math.random();
        var c = Math.random();
        GameHandler.adjustCubeSize(0,{x:a,y:b,z:c});

    });

    // write to content
    var pageContent = document.getElementById('content');
    var writeContent = function (msg) {
        if (typeof msg === 'string') {
            pageContent.innerHTML = '<p class="message">' + msg + '</p>' + pageContent.innerHTML;
        }
    };

}();

