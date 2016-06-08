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
        "qrcode.min": '/js/libs/qrcode.min',
        "gameApi": '/js/gameApi'
    },
    shim: {
        three: {
            exports: 'THREE'
        }
    }
});
var GameHandler = null, gameApi = null, frontChart = null;
/**
 * START OF THE FRONTEND APPLICATION
 * */
require(["3dgame", "gameApi", "jquery", "Chart"], function (game, api, $, Chart) {
    gameApi = api;
    GameHandler = game;

    var game2 = new game();
    game2.start();

});