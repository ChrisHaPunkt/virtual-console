/**
 * Created by chris on 19.04.2016.
 */
var config = require('../../config.json');
var database = require('./Database')();
var debug = config.debug;
var GameVO = require("./ValueObjects/GameVO");
var util = require('util');
var $ = require("jquery");


var persitNewGame = function (GameVO, callback) {

    var query = {unique_name: GameVO.unique_name};

    var insertCallback = function (state, data) {
        if (state && data.length == 0) {

            database.insert("games", GameVO.strip(), function(result){});

            if (typeof callback == "function")
                callback(true, "Game inserted " + GameVO.unique_name);

        } else {
            util.log("GameUnique schon vorhanden: " + data[0].unique_name);

            if (typeof callback == "function")
                callback(false, "GameUnique schon vorhanden: " + GameVO.unique_name);
        }
    };

    if (!GameVO.validate()) {
        if (typeof callback == "function")
            callback(false, "GameVO broken : " + GameVO.unique_name);
        else
            util.log("GameVO broken : " + GameVO.unique_name)
    } else {
        database.query("games", query, insertCallback);
    }


};
var updateGame = function (GameVO, callback) {

    var filter = {unique_name: GameVO.unique_name};
    var query = filter;

    var updateCallback = function (state, data) {
        if (state && data.length > 0) {

            database.remove("games", filter, function () {

                database.insert("games", GameVO.strip(), function () {

                    if (debug) util.log("Game updated: " + filter.unique_name);

                    if (typeof callback == "function")
                        callback(true, "Game updated " + filter.unique_name);

                });
            });
        } else {
            util.log("GameUnique nicht vorhanden: " + filter.unique_name);

            if (typeof callback == "function")
                callback(false, "GameUnique nicht vorhanden: " + filter.unique_name);
        }
    };

    if (!GameVO.validate()) {
        if (typeof callback == "function")
            callback(false, "GameVO broken : " + GameVO.unique_name);
        else
            util.log("GameVO broken : " + GameVO.unique_name)
    } else {
        database.query("games", query, updateCallback);
    }


};
var removeGame = function (GameVO_OR_uniqueName, callback) {

    var unique, filter;
    if (typeof GameVO_OR_uniqueName == "object") {
        unique = GameVO_OR_uniqueName.unique_name;
    } else {
        unique = GameVO_OR_uniqueName;

    }
    filter = {unique_name: unique};


    var removeCallback = function (state, data) {
        if (state && data.length == 1) {
            if (debug) util.log("Removing from DB: " + unique);

            database.remove("games", filter, callback);

            if (typeof callback == "function")
                callback(true, "Game removed " + unique);

        } else {
            if (debug) util.log("GameUnique nicht vorhanden: " + unique);

            if (typeof callback == "function")
                callback(false, "GameUnique nicht vorhanden: " + unique);
        }
    };

    database.query("games", filter, removeCallback);


};


var updateFullQualifiedGameVOs = function (callback) {
    getAllGames(function (state, msg) {
        if (state) {
            app.set("fullQualifiedGameVOs", msg);
        } else {

        }
    })
};
/**
 *
 * @param onSuccess
 * reutn array of GameVO
 */
var bindUrlId = 1;
var getAllGames = function (onSuccess) {
    var query = {};

    var queryCallback = function (state, msg) {
        if (state && msg[0]) {
            var GameVOs = [];

            msg.forEach(function (value) {
                var game = new GameVO(value.type, value.unique_name, value.displayName,bindUrlId);

                if (game.type == exports.TYPES.external)
                    game.addContentUrl(value.contentUrl);

                GameVOs.push(game);
                bindUrlId++;
            });
            onSuccess(true, GameVOs);
        } else {
            onSuccess(false, "No Games present in DB");
        }
    };
    database.query("games", query, queryCallback);
};


var reinitGames = function () {
    var gameRoute = require('../routes/gameRoute');
    //TODO:: socket.emit("redrawGames");
    var sessionHandling = require('./sessionHandling');
    util.log("reinit routes");
    gameRoute.rebindGameRoutes(function(state){
        if(state){
            sessionHandling.sendToFrontend_Data('gamesUpdated', {});

        }else{
            if(debug)util.log("rebindgameRoutes Error");
        }
    });
};

/**
 * EXPORT OBJECT / PUBLIC INTERFACE
 * */
var exports = {
    TYPES: {
        internal: 1,
        external: 2,
        native: 3
    },
    updateGame: function (GameVO, callback) {
        updateGame(GameVO, function () {

            reinitGames();
            if (typeof callback == "function")
                callback();
        });
    },
    remove: function (GameVO_orUnique, callback) {
        removeGame(GameVO_orUnique, function () {

            reinitGames();
            if (typeof callback == "function")
                callback();
        });
    },
    addNewGame: function (TYPE_OR_GAMEVO, NAME_OR_CALLBACK, url, displayName, callback) {

        if (TYPE_OR_GAMEVO instanceof GameVO) {

            if (debug) util.log("Got GameVO to persist " + TYPE_OR_GAMEVO.unique_name);
            persitNewGame(TYPE_OR_GAMEVO, function () {

                reinitGames();
                if (typeof callback == "function")
                    callback();
            });

        } else {

            var route = new RouteVO(TYPE_OR_GAMEVO, NAME_OR_CALLBACK, url, displayName);
            if (debug) util.log("Build new GameVO to persist: " + route);
            persitNewGame(route, function () {

                reinitGames();
                if (typeof callback == "function")
                    callback();
            });
        }

        return this;
    },
    getAllGames: function (callback) {
        getAllGames(callback);
        return this;
    },
    getAllRGamesByType: function (TYPE, callback) {

    }

};
// exporting the actual object
module.exports = exports;