/**
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
        "qrcode.min": '/js/libs/qrcode.min',
        "gameApi":'/js/gameApi'
    }
});

/**
 * START OF THE FRONTEND APPLICATION
 * */
require(["externalGames", "gameApi", "jquery"], function (externalGames, gameApi, $) {

    // API config
    gameApi.logLevel = gameApi.log.INFO;
    gameApi.controller = gameApi.controllerTemplates.MODERN;
    gameApi.performanceMonitor = false;
    gameApi.frontendType = 'external';

    /**
     * Handle new Controller Data
     * @param controllerData
     */
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
                // TODO trigger hardware keyboard events here?
                if (controllerEvent.buttonName == 'btn-left' && controllerEvent.buttonState === gameApi.BUTTON.DOWN) {

                }
                else if (controllerEvent.buttonName == 'btn-right' && controllerEvent.buttonState === gameApi.BUTTON.DOWN) {

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
     * Local Game Initialization
     * @param connInfoObj
     */
    gameApi.frontendConnection = function (connInfoObj) {
        gameApi.addLogMessage(gameApi.log.INFO, 'conn', connInfoObj + " " + gameApi.socket.id);

        this.emit('frontendOutboundMessage', {type: 'setControllerTemplate', data: gameApi.controller});


    };

    /**
     * INIT THE API - connect to server
     * */
    var socket = gameApi.init();

    /**
     * instantiate externalGames js
     * */
    var externalGamesInstance = new externalGames();

    externalGamesInstance.setSelectedGame(window.location.href.match(/game=([^&]+)/)[1]);

});