/**
 * Created by hannes on 31.03.2016.
 *
 * REQUIRE.JS CONFIG
 * This is necessary due to problems with the jquery and three js libraries.
 * See links below for further details.
 * */

// http://requirejs.org/docs/jquery.html#noconflictmap
define("jquery", [], function () {
    return jQuery.noConflict();
});
// http://requirejs.org/docs/api.html#config-shim
requirejs.config({
    paths: {
        "gameApi": '/js/gameApi',
        "qrcode.min": '/js/libs/qrcode.min'
    }
});

/**
 * START OF THE FRONTEND APPLICATION
 * */
require(["mainMenu", "gameApi", "jquery"], function (mainMenu, gameApi, $) {


    /**
     * API config
     */
        // set basic config properties
    gameApi.logLevel = gameApi.log.INFO;
    gameApi.controller = gameApi.controllerTemplates.EXTERN;

    // handle new Server Data
    // {type: messageType, data: message}
    gameApi.frontendInboundData = function(serverData){
        switch(serverData.type){
            case 'gamesUpdated':
                mainMenuInstance.redraw();
                break;
            default:
                console.error('Unknown server data: ', serverData);
        }
    };

    // handle new Controller Data
    gameApi.frontendInboundMessage = function (controllerData) {

        var controllerEvent = controllerData.data.message;

        gameApi.addLogMessage(gameApi.log.DEBUG, "on.FrontendInboundMessage", controllerData);
        var msgDetails = typeof controllerData.data.message === "object" ? JSON.stringify(controllerData.data.message) : controllerData.data.message;
        gameApi.addLogMessage(gameApi.log.DEBUG, 'client', controllerData.data.clientName + ': ' + msgDetails);

        switch (controllerData.type) {
            case "userConnection":
                gameApi.addLogMessage(gameApi.log.INFO, 'client', "Client " + controllerData.data.clientName + ' ' + controllerData.data.message);
                break;
            case "button":
                if (controllerEvent.buttonName == 'btn-enter' && controllerEvent.buttonState === gameApi.BUTTON.DOWN) {
                    mainMenuInstance.triggerActiveTile();
                }
                else if (controllerEvent.buttonName == 'btn-left' && controllerEvent.buttonState === gameApi.BUTTON.DOWN) {
                    mainMenuInstance.moveActiveTile('left');
                }
                else if (controllerEvent.buttonName == 'btn-right' && controllerEvent.buttonState === gameApi.BUTTON.DOWN) {
                    mainMenuInstance.moveActiveTile('right');
                }
                else if (controllerEvent.buttonName == 'btn-up' && controllerEvent.buttonState === gameApi.BUTTON.DOWN) {
                    mainMenuInstance.moveActiveTile('up');
                }
                else if (controllerEvent.buttonName == 'btn-down' && controllerEvent.buttonState === gameApi.BUTTON.DOWN) {
                    mainMenuInstance.moveActiveTile('down');
                }
                break;
            case "accelerationData":
                // possible not needed here
                break;
            case "orientationData":
                // possible not needed here
                break;
            default:
                break;
        }
    };

    /**
     * INIT game API
     * */
    var socket = gameApi.init();

    /**
     * START MAIN MENU
     * */
    var domContainer = $("#gameContainer");
    var mainMenuInstance = new mainMenu(domContainer, gameApi);
    console.log(mainMenuInstance);

});