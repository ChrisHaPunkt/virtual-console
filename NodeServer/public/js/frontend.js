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

/**
 * START OF THE FRONTEND APPLICATION
 * */
require(["frontendNetwork", "3dgame"], function (network, game) {

    network.initNetwork({
        onMessage: function (data) {
            console.log("Message from Sever: ", data);

            writeContent('client ' + data.data.clientName + ': ' + data.data.message);

            if (data.type == "button") {

                var a = 200 * Math.random();
                var b = 200 * Math.random();
                var c = 200 * Math.random();

                game.adjustCubeSize(0, {x: a, y: b, z: c});
            }
        }
    }).start();

    // write to content
    var pageContent = document.getElementById('content');
    var writeContent = function (msg) {
        if (typeof msg === 'string') {
            pageContent.innerHTML = '<p class="message">' + msg + '</p>' + pageContent.innerHTML;
        }
    };

});