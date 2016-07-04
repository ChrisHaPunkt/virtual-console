var express = require('express');
var requirejs = require('requirejs');
var util = require('util');
var config = require('../../config.json');
var debug = config.debug;
requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});
var router = express.Router();
var htmlControllerContent = '';

/* GET home page. */
router.get('/', function (req, res, next) {

    /*
    var controller = null;
    switch (chosenControllerTemplate) {
        case gameController.MODERN:
            controller = "controller/" + "controllerModern";
            break;
        case gameController.EXTERN:
            controller = "controller/" + "controllerExternal";
            break;
        default:
            controller = "controller/" + "controllerExternal";
            break;
    }*/

    // TODO Fix mapping
    var gameController = {
        NEW: 5,
        MODERN: 6,
        EXTERN: 7
    };
    var controller = {
        controllerModern: gameController.MODERN,
        controllerExternal: gameController.EXTERN
    };

    var renderedControllerCount = 0;
    var controllerBasePath = "controller/";

    // pre-render each controller template and add to one string variable 'htmlContent' if not done before
    if (htmlControllerContent === '') {
        for (var key in controller) {

            if (!controller.hasOwnProperty(key)) continue;

            res.render(
                controllerBasePath + key,
                {
                    controllerID: 'controller_' + controller[key],
                    controllerCSS: key
                },
                function (err, tmpContent) {
                    htmlControllerContent += tmpContent;
                    renderedControllerCount++;
                });

        }
        // wait for all render functions to return
        // TODO: improve, this blocks the program
        while (renderedControllerCount != Object.keys(controller).length) {
            if (debug) util.log('.');
        }
    }

    if (debug) util.log(htmlControllerContent);

    // render controller main template with all controllers
    res.render('controller/index', {
        title: 'Controller',
        controller: htmlControllerContent
    });

});

module.exports = router;
