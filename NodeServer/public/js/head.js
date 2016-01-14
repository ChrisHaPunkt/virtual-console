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
        "three": "libs/three",
        "Chart": "libs/Chart.min",
        "phaser": 'libs/phaser'
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
require(["phaser", "game", "gameApi", "jquery", "Chart"], function (Phaser, game, api, $, Chart) {
    gameApi = api;
    GameHandler = game;
    $('#monitorBtn').click(function () {
        $('#chart').show();
        gameApi.performanceMonitor = true;
        var data = {
            labels: [0],
            datasets: [{
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [0]
            }]
        };
        gameApi.chart.data = data;
        //render Chart
        // Get context with jQuery - using jQuery's .get() method.
        var ctx = $("#myChart").get(0).getContext("2d");
        // This will get the first returned node in the jQuery collection.
        frontChart = new Chart(ctx).Line(data, {
            maintainAspectRatio: false,
            responsive: true
        });
        gameApi.chart.chartObj = frontChart;
        console.log("+Chart");




    });

    if(gameApi.performanceMonitor && typeof gameApi.chartObj !== "undefined"){
        $('#monitorBtn').trigger("click");
    }
    var game = new game();
    game.start();



});