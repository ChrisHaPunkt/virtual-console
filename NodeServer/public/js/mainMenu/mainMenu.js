/**
 * Created by hannes on 31.03.2016.
 */

define(['jquery', 'gameApi'], function ($, gameApi) {

        var MainMenu = function (domContainer, gameApi) {

            // init dom reference object
            this.domElements = {};
            this.domElements.domContainer = domContainer;

            // set reference to game API
            this.gameApi = gameApi;

            // load game data from server
            this.gameData = {};
            MainMenu.prototype.loadGameData.call(this); // call prototype function with context of current 'new' object

            // init keyboard listening
            MainMenu.prototype.initKeyboardInput.call(this);

        };

        MainMenu.prototype.loadGameData = function () {

            gameApi.getGameData(function (data) {
                gameApi.addLogMessage(gameApi.log.INFO, "data", "Server send game data!");
                console.log(data);
                this.gameData = data;
                MainMenu.prototype.initGameTiles.call(this, this.domElements.domContainer);
            }.bind(this));

            return true;

        };

        MainMenu.prototype.initGameTiles = function (parent) {
            var i = 0;
            this.gameData.forEach(function (game) {
                $('<div/>', {
                    id: game.unique_name + '_tile',
                    class: 'gameTile',
                    click: function () {
                        window.location = $(this).attr('path');
                    },
                    path: game.fullUrl,
                    tileIndex: i++
                }).html(game.unique_name).appendTo(parent);
            });

            // set center game tile active
            var gameTilesLength = $('.gameTile').length;
            $('.gameTile:eq(' + Math.floor(gameTilesLength/2) +')').addClass('activeTile');
        };

        MainMenu.prototype.redraw = function () {
            MainMenu.prototype.loadGameData.call(this);
        };

        MainMenu.prototype.initKeyboardInput = function(){

            MainMenu.prototype.keys = {
                LEFT_ARROW: 37,
                UP_ARROW: 38,
                RIGHT_ARROW: 39,
                DOWN_ARROW: 40,
                ENTER: 13
            };

            //$(document)
            //$("html").keypress(function(event){
            //this.domElements.domContainer.keypress(function(event){
            window.addEventListener('keydown', function(event) {

                var numberOfTiles = $('.gameTile').length;
                var activeTile = $('.activeTile');
                var tileIndex = parseInt(activeTile.attr("tileIndex"));

                var key = event.keyCode ? event.keyCode : event.which;

                switch (key){
                    case MainMenu.prototype.keys.ENTER:
                        activeTile.trigger( "click" );
                        break;
                    case MainMenu.prototype.keys.LEFT_ARROW:
                        if(!(tileIndex <= 0)){
                            var leftNeighbour = $('div[tileIndex=' + parseInt(tileIndex - 1) + ']');
                            leftNeighbour.addClass('activeTile');
                            activeTile.removeClass('activeTile');
                        }
                        break;
                    case MainMenu.prototype.keys.UP_ARROW:
                        break;
                    case MainMenu.prototype.keys.RIGHT_ARROW:
                        if(!(tileIndex >= numberOfTiles-1)) {
                            var rightNeighbour = $('div[tileIndex=' + parseInt(tileIndex + 1) + ']');
                            rightNeighbour.addClass('activeTile');
                            activeTile.removeClass('activeTile');
                        }
                        break;
                    case MainMenu.prototype.keys.DOWN_ARROW:
                        break;
                }
            });

        //MainMenu.prototype
        };

        // return public interface of the require module
        return MainMenu;

    }
);