/**
 * Created by hannes on 31.03.2016.
 */

define(['jquery'], function ($) {

        var MainMenu = function (domContainer, gameApi, that) {

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

            // add external game container
            this.domElements.extGameContainer = $('<div/>', {
                id: 'EXTgameContainer',
                class: 'gameContainer'
            }).html('<p>External Games</p>').appendTo(this.domElements.domContainer);

            // load game data from server
            this.gameData = {};
            MainMenu.prototype.loadGameData.call(this); // call prototype function with context of current 'new' object

            // draw game tiles
            MainMenu.prototype.initAPIGameTiles.call(this, this.domElements.apiGameContainer);
            MainMenu.prototype.initEXTGameTiles.call(this, this.domElements.extGameContainer);

        };

        MainMenu.prototype.loadGameData = function () {

            // TODO get these from DB
            this.gameData = {
                intGamesBasePath: "/games/int",
                extGamesBasePath: "/games/ext",
                intGames: [
                    {id: 'matrixGame', path: '/1', imgUrl: ''},
                    {id: 'carsGame', path: '/2', imgUrl: ''},
                    {id: '3dGame', path: '/3', imgUrl: ''}
                ],
                extGames: [
                    {id: 'extGame1', imgUrl: ''},
                    {id: 'extGame2', imgUrl: ''},
                    {id: 'extGame3', imgUrl: ''}
                ]
            };

            return true;

        };

        MainMenu.prototype.initAPIGameTiles = function (parent) {
            for (var i = 0; i < this.gameData.intGames.length; i++) {
                $('<div/>', {
                    id: this.gameData.intGames[i].id + '_tile',
                    class: 'gameTile internal',
                    click: function () {
                        window.location = $(this).attr('path');
                    },
                    path: this.gameData.intGamesBasePath + this.gameData.intGames[i].path
                }).html(this.gameData.intGames[i].id).appendTo(parent);
            }
        };

        MainMenu.prototype.initEXTGameTiles = function (parent) {
            for (var i = 0; i < this.gameData.extGames.length; i++) {
                $('<div/>', {
                    id: this.gameData.extGames[i].id + '_tile',
                    class: 'gameTile external',
                    click: function () {
                        window.location = $(this).attr('path');
                    },
                    path: this.gameData.extGamesBasePath + '?game=' + this.gameData.extGames[i].id
                }).html(this.gameData.extGames[i].id).appendTo(parent);
            }
        };

        MainMenu.prototype.redraw = function () {
            MainMenu.prototype.initAPIGameTiles.call(this, this.domElements.apiGameContainer);
            MainMenu.prototype.initEXTGameTiles.call(this, this.domElements.extGameContainer);
        };

        // return public interface of the require module
        return MainMenu;

    }
);