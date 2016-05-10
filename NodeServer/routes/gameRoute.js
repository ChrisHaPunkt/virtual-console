var express = require('express');
var router = express.Router();
var config = require('../../config.json');
var debug = config.debug;
var util = require('util');

var GamesHandler = require('../sources/Games');
var routes;

function rebindGameRoutes() {
    GamesHandler.getAllGames(function (state, msg) {
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
}

rebindGameRoutes();
router.rebindGameRoutes = rebindGameRoutes;
module.exports = router;
