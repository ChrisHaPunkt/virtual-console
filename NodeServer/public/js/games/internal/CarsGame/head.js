/**
 * Created by chrisheinrichs on 10.12.15.
 */
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
        "three": "/js/libs/three",
        "Chart": "/js/libs/Chart.min",
        "phaser": '/js/libs/phaser',
        "qrcode.min": '/js/libs/qrcode.min',
        "carsGame": 'carsGame',
        "gameApi":'/js/gameApi'
    },
    shim: {
        three: {
            exports: 'THREE'
        },
        'phaser': {
            exports: 'Phaser'
        }
    }
});
var GameHandler = null, gameApi = null, frontChart = null;
/**
 * START OF THE FRONTEND APPLICATION
 * */
require(["phaser", "carsGame", "gameApi", "jquery", "Chart"], function (Phaser, game, api, $, Chart) {
    gameApi = api;
    GameHandler = game;

    var game2 = new game();
    game2.start();
});