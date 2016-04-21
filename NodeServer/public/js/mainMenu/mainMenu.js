/**
 * Created by hannes on 31.03.2016.
 */

define(['jquery'], function ($) {

        // TODO get these from DB
        var gameInfoData = {
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

        var init = function (domContainer, gameApi) {
            var apiGameContainer = $('<div/>', {
                id: 'APIgameContainer',
                class: 'gameContainer'
            }).html('<p>API Games</p>').appendTo(domContainer);

            var extGameContainer = $('<div/>', {
                id: 'EXTgameContainer',
                class: 'gameContainer'
            }).html('<p>External Games</p>').appendTo(domContainer);

            initAPIGameTiles(apiGameContainer);
            initEXTGameTiles(extGameContainer);
        };

        var initAPIGameTiles = function (parent) {
            for (var i = 0; i < gameInfoData.intGames.length; i++) {
                $('<div/>', {
                    id: gameInfoData.intGames[i].id + '_tile',
                    class: 'gameTile internal',
                    click: function () {
                        window.location = gameInfoData.intGamesBasePath + $(this).attr('path');
                    },
                    path: gameInfoData.intGames[i].path
                }).html(gameInfoData.intGames[i].id).appendTo(parent);
            }
        };

        var initEXTGameTiles = function (parent) {
            for (var i = 0; i < gameInfoData.extGames.length; i++) {
                $('<div/>', {
                    id: gameInfoData.extGames[i].id + '_tile',
                    class: 'gameTile external',
                    click: function () {
                        window.location = gameInfoData.extGamesBasePath + '?game=' + $(this).attr('path');
                    },
                    path: gameInfoData.extGames[i].id
                }).html(gameInfoData.extGames[i].id).appendTo(parent);
            }
        };

        // return public interface of the require module
        return {
            init: init
        };

    }
);