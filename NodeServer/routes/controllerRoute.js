var express = require('express');
var requirejs = require('requirejs');
var util = require('util');

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
        NEW: 5,
        MODERN: 6,
        EXTERN: 7
    };

    util.log("CONTROLERROUTE", chosenControllerTemplate);

/*    var controller = null;
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

    var controller = ['controllerModern', 'controllerExternal'];
    var renderedControllerCount = 0;
    var controllerBasePath = "controller/";
    var htmlContent = '';

    controller.forEach(function (value) {

        res.render(
            controllerBasePath + value,
            {
                controllerID: value
            },
            function (err, htmlControllerContent) {
                htmlContent += htmlControllerContent;
                renderedControllerCount++;
            });

    });

    while(renderedControllerCount != controller.length){
        console.log('.');
    }

    console.log(renderedControllerCount);
    console.log(htmlContent);

    res.render('controller/index', {
        title: 'Login',
        controller: htmlContent
    });

/*    res.render(controller, function (err, htmlControllerContent) {

        res.render('controller/index', {
            title: 'Login',
            controller: htmlControllerContent
        });

    });*/

});

module.exports = router;
