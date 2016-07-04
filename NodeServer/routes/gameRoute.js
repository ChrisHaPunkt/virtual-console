var express = require('express');
var router = express.Router();
var config = require('../../config.json');
var debug = config.debug;
var util = require('util');

var GamesHandler = require('../sources/Games');
var routes;

function rebindGameRoutes(callback) {
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

                if (debug) util.log(bindUrl, viewRenderPath);
                router.get(bindUrl, function (req, res, next) {
                    if (game.type == TYPES.external) {
                        var url = game.contentUrl.indexOf("http") === 0 ? game.contentUrl : 'http://' + game.contentUrl;
                        res.render(viewRenderPath, {
                            title: '--:: ' + game.displayName + ' ::-- ',
                            url: url
                        });
                    }

                    else
                        res.render(viewRenderPath, {title: '--:: ' + game.displayName + ' ::-- '});
                });

            });

            if(typeof callback == "function"){
                callback(true);
            }
        } else {
            if(typeof callback == "function"){
                callback(false);
            }
            if (debug) util.log("callback get All Routes " + msg);
            app.set("fullQualifiedGameVOs", false);

            routes = [];
        }
    });
}

rebindGameRoutes();
router.rebindGameRoutes = rebindGameRoutes;
module.exports = router;
