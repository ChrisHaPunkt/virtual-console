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
            database.insert("games", GameVO.strip(), callback);

            if (typeof callback == "function")
                callback(true, "Game inserted " + GameVO);

        } else {
            if (typeof callback == "function")
                callback(false, "GameUnique schon vorhanden: " + GameVO);
        }
    };

    if (!GameVO.validate()) {
        callback(false, "GameVO broken : " + GameVO);
    } else {
        database.query("games", query, insertCallback);
    }


};

/**
 *
 * @param onSuccess
 * reutn array of GameVO
 */
var getAllGames = function (onSuccess) {
    var query = {};

    var queryCallback = function (state, msg) {
        if (state && msg[0]) {
            var GameVOs = [];
            var i = 1;
            msg.forEach(function (value) {
                var game = new GameVO(value.type, value.unique_name, value.displayName, i);

                if(game.type == exports.TYPES.external)
                    game.addContentUrl(value.contentUrl)

                GameVOs.push(game);
              i++;
            });
            onSuccess(true, GameVOs);
        } else {
            onSuccess(false, "No Games present in DB");
        }
    };
    database.query("games", query, queryCallback);
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

    addNewGame: function (TYPE_OR_GAMEVO, NAME_OR_CALLBACK, url, displayName, callback) {

        if (TYPE_OR_GAMEVO instanceof GameVO) {

            if (debug) util.log("Got GameVO to persist " + TYPE_OR_GAMEVO);
            persitNewGame(TYPE_OR_GAMEVO, NAME_OR_CALLBACK);

        } else {

            var route = new RouteVO(TYPE_OR_GAMEVO, NAME_OR_CALLBACK, url, displayName);
            if (debug) util.log("Build new GameVO to persist: " + route);
            persitNewGame(route, callback);
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