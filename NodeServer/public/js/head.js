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
        "three": "libs/three"
    },
    shim: {
        three: {
            exports: 'THREE'
        }
    }
});
var GameHandler = null, gameApi = null;
/**
 * START OF THE FRONTEND APPLICATION
 * */
require(["3dgame", "gameApi", "jquery", "/js/lib/Chart.min.js"], function (game, api, $, Chart) {
    gameApi = api;
    GameHandler = game;
    console.log(game);

    // Get context with jQuery - using jQuery's .get() method.
    var ctx = $("#myChart").get(0).getContext("2d");
// This will get the first returned node in the jQuery collection.
    var myNewChart = new Chart(ctx);

});