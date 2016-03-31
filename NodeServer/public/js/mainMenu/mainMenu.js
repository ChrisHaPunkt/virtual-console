/**
 * Created by hannes on 31.03.2016.
 */

define(['jquery'], function ($) {

        // TODO get these from DB
        var tmpData = [
            {id: 'matrixGame', path: '/1', imgUrl: ''},
            {id: 'carsGame', path: '/2', imgUrl: ''},
            {id: '3dGame', path: '/3', imgUrl: ''}
        ];

        var init = function (domContainer, gameApi) {
            var apiGameContainer = $('<div/>', {
                id: 'api_game_container',
                css: {
                    'min-height': '200px',
                    'background-color': 'transparent',
                    margin: '25px'
                }
            }).html('<p>API Games</p>').appendTo(domContainer);

            initAPIGameTiles(apiGameContainer);
        };

        var initAPIGameTiles = function (parent) {
            for (var i = 0; i < tmpData.length; i++) {
                $('<div/>', {
                    id: tmpData[i].id + '_tile',
                    class: 'gameTile',
                    css: {
                        width: '100px',
                        height: '100px',
                        'background-color': 'black',
                        float: 'left',
                        margin: '25px',
                        color: 'white',
                        'text-align': 'center',
                        'line-height': '100px'
                    },
                    click: function () {
                        document.location = document.location + $(this).attr('path');
                    },
                    path: tmpData[i].path
                }).html(tmpData[i].id).appendTo(parent);
            };
        };

        // return public interface of the require module
        return {
            init: init
        };

    }
);