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
        "gameApi":'/js/gameApi'
    }
});

/**
 * START OF THE FRONTEND APPLICATION
 * */
require(["gameApi", "jquery"], function (api, $) {

});