/**
 * Created by chris on 19.04.2016.
 */
var config = require('../../config.json');
var database = require('./Database')();
var debug = config.debug;
var RouteVO = require("./ValueObjects/RouteVO");
var util = require('util');

var persitNewRoute = function (RouteVO, callback) {


    var query = {unique_name: RouteVO.unique_name};


    if (!RouteVO.validate()) {
        if (debug) util.log(RouteVO);

        callback(false, "RouteVO broken : " + RouteVO);
    } else {
        database.query("routes", query, insertCallback);
    }

    var insertCallback = function (state, data) {
        if (state && data.length == 0) {
            database.insert("routes", RouteVO, callback);


        } else {
            callback(false, "Route schon vorhanden: " + RouteVO);
        }
    }

};

var getAllRoutes = function ( onSuccess) {
    var query = {name: userName};

    var queryCallback = function (state, msg) {
        //The user exist
        if (state && msg[0]) {
            onSuccess(true, msg[0].data);
        } else {
            onSuccess(false, msg);
        }
    };
    database.query("routes", query, queryCallback);
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

    addNewRoute: function (TYPE_OR_ROUTEVO, name, url, displayName, callback) {

        if(TYPE_OR_ROUTEVO instanceof RouteVO){

            if (debug) util.log("Got RouteVO to persist "+RouteVO);
            persitNewRoute(TYPE_OR_ROUTEVO, callback);
        }else{

            var route = new RouteVO(TYPE, name, url, displayName);
            if (debug) util.log("Build new RouteVO to persist: "+route);
            persitNewRoute(route, callback);
        }
        return this;
    },
    getAllRoutes: function (callback) {

        return this;
    },
    getAllRoutesByType: function (TYPE, callback) {

    }

};
// exporting the actual object
module.exports = exports;