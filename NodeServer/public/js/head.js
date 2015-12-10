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

/**
 * START OF THE FRONTEND APPLICATION
 * */
require(["3dgame"], function (game) {

    console.log(game);

});