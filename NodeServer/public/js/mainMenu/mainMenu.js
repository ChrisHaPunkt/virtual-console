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

            // add API game container
            this.domElements.apiGameContainer = $('<div/>', {
                id: 'APIgameContainer',
                class: 'gameContainer'
            }).html('<p>API Games</p>').appendTo(this.domElements.domContainer);

            // load game data from server
            this.gameData = {};
            MainMenu.prototype.loadGameData.call(this); // call prototype function with context of current 'new' object

            // draw game tiles
            //MainMenu.prototype.initGameTiles.call(this, this.domElements.apiGameContainer);
            //MainMenu.prototype.initEXTGameTiles.call(this, this.domElements.extGameContainer);

        };

        MainMenu.prototype.loadGameData = function () {

            gameApi.getGameData(function (data) {
                gameApi.addLogMessage(gameApi.log.INFO, "data", "Server send game data!");
                this.gameData = data;
                MainMenu.prototype.initGameTiles.call(this, this.domElements.apiGameContainer);
            }.bind(this));

            return true;

        };

        // TODO render all games with this
        MainMenu.prototype.initGameTiles = function (parent) {
            this.gameData.data.forEach(function (game) {
                $('<div/>', {
                    id: game.unique_name + '_tile',
                    class: 'gameTile internal',
                    click: function () {
                        window.location = $(this).attr('path');
                    },
                    path: game.fullUrl
                }).html(game.unique_name).appendTo(parent);
            })
        };

        MainMenu.prototype.redraw = function () {
            MainMenu.prototype.loadGameData.call(this);
        };

        // return public interface of the require module
        return MainMenu;

    }
);