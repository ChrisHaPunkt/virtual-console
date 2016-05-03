var express = require('express');
var router = express.Router();
var config = require('../../config.json');
var debug = config.debug;
var util = require('util');

var RoutesHandler = require('../sources/Games');
var routes;


/* GET client listing. */
router.get('/', function (req, res, next) {
    res.render('mainMenu/frontend', {title: 'Main Menu'});
});
//router.get('/ext', function (req, res, next) {
//    res.render('games/external/frontend', {title: 'External Games'});
//});


RoutesHandler.getAllGames(function (state, msg) {
    var app = require('../app');
    var TYPES = require('../sources/Games').TYPES;

    if (state) {
        routes = msg;

        //FullGeneratedRouteVOs for frontend menu generation
        app.set("fullQualifiedGameVOs", routes);


        if (debug) util.log("Got " + msg.length + " Routes from DB");

        routes.forEach(function (game) {
            var game = game;

            var bindUrl = '/' + game.namespaceShort + '/' + game.urlId;
            var viewRenderPath = game.type == TYPES.internal ?
            'games/' + game.namespace + '/' + game.unique_name + '/frontend' :
                'games/external/frontend';

            util.log(bindUrl, viewRenderPath);
            router.get(bindUrl, function (req, res, next) {
                if (game.type == TYPES.external)
                    res.render(viewRenderPath, {
                        title: '--:: ' + game.displayName + ' ::-- ',
                        url: game.contentUrl
                    });

                else
                    res.render(viewRenderPath, {title: '--:: ' + game.displayName + ' ::-- '});
            });

        });

    } else {
        if (debug) util.log("callback get All Routes " + msg);
        app.set("fullQualifiedGameVOs", false);

        routes = [];
    }
});

/*
 router.get('/int/1', function (req, res, next) {
 res.render('games/internal/MatrixGame/frontend', {title: '--:: Matrix Demo Game ::-- '});
 });
 router.get('/int/2', function (req, res, next) {
 res.render('games/internal/CarsGame/frontend', {title: '--:: Cars Demo Game ::-- '});
 });
 router.get('/int/3', function (req, res, next) {
 res.render('games/internal/3DGame/frontend', {title: '--:: ThreeD Game ::-- '});
 });
 */
module.exports = router;
