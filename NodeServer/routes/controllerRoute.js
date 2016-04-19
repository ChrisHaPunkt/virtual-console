var express = require('express');
var requirejs = require('requirejs');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var chosenControllerTemplate = require('../app').get('chosenControllerTemplate');

    var gameController = {
        DEMO: 4,
        NEW: 5,
        MODERN: 6
    };

    //var gameController = requirejs("../public/js/gameApi").controllerTemplates;
    /*
    // http://stackoverflow.com/questions/23179827/node-js-socket-io-socket-io-js-not-found-express-4-0
    var gameController;
    requirejs(["../public/js/gameApi"], function(gameApi){
        gameController = gameApi.controllerTemplates;
    });
    */

    var controller = null;
    switch (chosenControllerTemplate) {
        case gameController.DEMO:
            controller = "controller/" + "controllerDemo";
            break;
        case gameController.MODERN:
            controller = "controller/" + "controllerModern";
            break;
        default:
            controller = "controller/" + "controllerDemo";
            break;
    }

    res.render(controller, function (err, htmlControllerContent) {

        res.render('controller/index', {
            title: 'Login',
            controller: htmlControllerContent
        });

    });

});

module.exports = router;
