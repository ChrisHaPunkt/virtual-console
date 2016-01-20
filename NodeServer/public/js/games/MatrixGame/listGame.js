/**
 * Created by hannes on 12.01.2016.
 */
define(['jquery', 'gameApi', '../../libs/qrcode.min'], function ($, gameApi, qrcode) {

    var domContainer = $("#3d");
    var run = true;

    // set ui properties
    //$('#monitorBtn').html('List Game');
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


/*

        var clientName = data.data.clientName;
        var message = data.data.message;

        //console.log(data);

        switch (data.type) {
            case "userConnection":
                gameApi.addLogMessage(gameApi.log.INFO, 'client', 'Client ' + clientName + ' ' + message);

                if (message === 'connected') {
                    initUserContainer(clientName);
                } else if (message === 'disconnected') {
                    breakUserContainer(clientName);
                }
                break;
            case "button":
                addLine(clientName, 'BUTTON | ' + message.buttonName + ' | ' + message.buttonState);
                break;
            case "accelerationData":

                break;
            case "orientationData":
                addLine(clientName, 'ORIENTATION | ' + message.orientationAlpha + ' | ' + message.orientationBeta + ' | ' + message.orientationGamma);
                break;
            default:
                break;
        }
 */


    };


/*
    gameApi.logLevel = gameApi.log.INFO;
    gameApi.controller = gameApi.controllerTemplates.MODERN;
*/




    /*
    Game-Anwendung
     */
    var initUserContainer = function (name) {
        //  domContainer.append('<div id="' + name + '" class="user-container"><div class="user-name">' + name + '</div><div class="user-messages"><ul class="messages"></ul></div></div>');

        var genColor = "#44c767";

        var newDivContainer = $("<div>", {
            id: name,
            class: "user-container"
        }).click(function () {
            console.log("Send to User");
            gameApi.sendToUser($(this).attr('id'), 'vibrate');
        }).append('<div class="user-name"><button style="background-color: ' + genColor + ';" class="myButton">' + name + '</button></div><div class="user-messages"><ul class="messages"></ul></div>');
        domContainer.append(
            newDivContainer
        );
        addLine(name, 'Hello ' + name);

    };
    $(".user-container").on('click', function () {
        console.log("Send to User");
        gameApi.sendToUser($(this).attr('id'), 'vibrate');
    });
    var breakUserContainer = function (name) {
        $('#' + name).remove();
    };

    var addLine = function (username, line) {

        var div = $('#' + username);
        var list = div.find('.messages');
        var listElements = list.find('li');

        // remove top element if max messages reached
        if (listElements.length > 10) {
            listElements[10].remove();
        }

        // add new line
        list.prepend('<li>> ' + line + '</li>');

    };

    /**
     * GAME INIT
     * */
    var gameSocketInstance = gameApi.init();

    //generate QRCode

    var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: ""+gameSocketInstance.io.uri,
        width: 128,
        height: 128
    });
    //click listener for hiding qrcode
    var qrcode_hidden = false;
    $("#qrcode").on('click', function () {
        if(qrcode_hidden) {
            $(this).css('opacity', 1);
            qrcode_hidden = false;
        }else{
            $(this).css('opacity', 0);
            qrcode_hidden = true;
        }
    });

    /**
     * EXPORTs
     * */
    return {
        start: function () {
            run = true;
        },
        stop: function () {
            run = false;
        }
    };

});