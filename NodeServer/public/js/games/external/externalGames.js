/**
 * Created by hannes on 18.04.2016.
 */
define(['jquery', 'gameApi'], function ($, gameApi) {

        // Constructor
        function ExternalGames(){}

        ExternalGames.prototype.setSelectedGame = function(gameId){
            this.gameId = gameId;
            console.log('Selected game is: ' + this.gameId);
        };

        // return public interface of the require module
        return ExternalGames;


        /**
         * ------------- ApiInitialization Part -------------
         */

        /**
         *
         * @type {number}
         */
        gameApi.logLevel = gameApi.log.INFO;
        gameApi.controller = gameApi.controllerTemplates.MODERN;
        gameApi.performanceMonitor = false;

        gameApi.frontendInboundMessage = function (controllerData) {
    
            var controllerEvent = controllerData.data.message;
            if (gameApi.performanceMonitor && (controllerData.type == "button" || controllerData.type == "accelerationData" || controllerData.type == "orientationData")) {
                var timestamp = Date.now();
                var chart = gameApi.chart.chartObj;
                console.log("Delay: " + (timestamp - controllerEvent.timestamp) + " ms");
                if(chart.datasets[0].points.length > 30){
                    //cleanup first points for a sliding view
                    chart.removeData();
                }
                chart.addData([(timestamp - controllerEvent.timestamp)],(timestamp - controllerEvent.timestamp) + " ms");
            }
    
            gameApi.addLogMessage(gameApi.log.DEBUG, "on.FrontendInboundMessage", controllerData);
            var msgDetails = typeof controllerData.data.message === "object" ? JSON.stringify(controllerData.data.message) : controllerData.data.message;
            gameApi.addLogMessage(gameApi.log.DEBUG, 'client', controllerData.data.clientName + ': ' + msgDetails);
    
    
            switch (controllerData.type) {
                case "userConnection":
                    gameApi.addLogMessage(gameApi.log.INFO, 'client', "Client " + controllerData.data.clientName + ' ' + controllerData.data.message);
                    break;
                case "button":
                    if (controllerEvent.buttonName == 'btn-left' && controllerEvent.buttonState === gameApi.BUTTON.DOWN) {
                        
                    }
                    else if (controllerEvent.buttonName == 'btn-right' && controllerEvent.buttonState === gameApi.BUTTON.DOWN) {
    
                    }
                    break;
                case "accelerationData":
    
                    break;
                case "orientationData":
                    gameApi.addLogMessage(gameApi.log.DEBUG, "Delay",  (timestamp - controllerEvent.timestamp)  + " ms");
    
                    GameHandler.setRotationRelative(0, {
                        x: controllerEvent.orientationAlpha,
                        y: controllerEvent.orientationBeta,
                        z: controllerEvent.orientationGamma
                    });
                    break;
                default:
                    break;
            }
    
        };
    }
);