/**
 * Created by hannes on 12.01.2016.
 */
define(['jquery', 'gameApi'], function ($, gameApi) {
    gameApi.logLevel = gameApi.log.INFO;
    gameApi.controller = gameApi.controllerTemplates.MODERN;

    var domContainer = $("#3d");
    var run = true;

    // set ui properties
    $('#monitorBtn').html('List Game');
    $('body').css('background', '#000');

    /**
     * HANDSHAKE
     * */
    gameApi.frontendConnection = function (connInfoObj) {
        gameApi.addLogMessage(gameApi.log.INFO, 'conn', connInfoObj + " " + gameApi.socket.id);
        this.emit('frontendOutboundMessage', {type: 'setControllerTemplate', data: gameApi.controller});
    };

    /**
     * INCOMING DATA HANDLING
     * */
    gameApi.frontendInboundMessage = function (data) {

        var clientName = data.data.clientName;
        var message = data.data.message;

        //console.log(data);

        switch (data.type) {
            case "userConnection":
                gameApi.addLogMessage(gameApi.log.INFO, 'client', 'Client ' + clientName + ' ' + message);

                if(message === 'connected') {
                    initUserContainer(clientName);
                }else if (message === 'disconnected'){
                    breakUserContainer(clientName);
                }
                break;
            case "button":
                addLine(clientName,'BUTTON | ' + message.buttonName + ' | ' + message.buttonState);
                break;
            case "accelerationData":

                break;
            case "orientationData":
                addLine(clientName,'ORIENTATION | ' + message.orientationAlpha + ' | ' + message.orientationBeta + ' | ' + message.orientationGamma);
                break;
            default:
                break;
        }
    };

    var initUserContainer = function(name){
        domContainer.append('<div id="' + name + '" class="user-container"><div class="user-name">' + name + '</div><div class="user-messages"><ul class="messages"></ul></div></div>');
        addLine(name, 'Hello ' + name);
    };
    var breakUserContainer = function(name){
        $('#'+name).remove();
    };

    var addLine = function(username, line){

        var div = $('#'+username);
        var list = div.find('.messages');
        var listElements = list.find('li');

        // remove top element if max messages reached
        if(listElements.length > 10){
            listElements[0].remove();
        }

        // add new line
        list.append('<li>> ' + line + '</li>');

    };

    /**
     * GAME INIT
     * */
    var gameInstance = gameApi.init();

    /**
     * EXPORTs
     * */
    return {
        start:function(){run = true;},
        stop:function(){run = false;}
    };

});