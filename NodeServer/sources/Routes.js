/**
 * Created by chris on 19.04.2016.
 */
var config = require('../../config.json');
var database = require('./Database')();
var debug = config.debug;
var RouteVO = require("./ValueObjects/RouteVO");
var util = require('util');
var $ = require("jquery");

var persitNewRoute = function (RouteVO, callback) {


    var query = {unique_name: RouteVO.unique_name};
    var insertCallback = function (state, data) {
        if (state && data.length == 0) {
            database.insert("routes", RouteVO.strip(), callback);

            if (typeof callback == "function")
                callback(true, "Route insertet " + RouteVO);

        } else {
            if (typeof callback == "function")
                callback(false, "Route schon vorhanden: " + RouteVO);
        }
    };

    if (!RouteVO.validate()) {
        callback(false, "RouteVO broken : " + RouteVO);
    } else {
        database.query("routes", query, insertCallback);
    }


};

/**
 *
 * @param onSuccess
 * reutn array of RouteVO
 */
var getAllRoutes = function (onSuccess) {
    var query = {};

    var queryCallback = function (state, msg) {
        if (state && msg[0]) {
            var RouteVOs = [];
            var i = 1;
            msg.forEach(function (value) {
                RouteVOs.push(new RouteVO(value.type, value.unique_name, value.displayName, i));
                if (debug) {
                    util.log(RouteVOs);
                }
                i++;
            });
            onSuccess(true, RouteVOs);
        } else {
            onSuccess(false, "No Routes in DB");
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

    addNewRoute: function (TYPE_OR_ROUTEVO, NAME_OR_CALLBACK, url, displayName, callback) {

        if (TYPE_OR_ROUTEVO instanceof RouteVO) {

            if (debug) util.log("Got RouteVO to persist " + TYPE_OR_ROUTEVO);
            persitNewRoute(TYPE_OR_ROUTEVO, NAME_OR_CALLBACK);

        } else {

            var route = new RouteVO(TYPE_OR_ROUTEVO, NAME_OR_CALLBACK, url, displayName);
            if (debug) util.log("Build new RouteVO to persist: " + route);
            persitNewRoute(route, callback);
        }

        return this;
    },
    getAllRoutes: function (callback) {
        getAllRoutes(callback);
        return this;
    },
    getAllRoutesByType: function (TYPE, callback) {

    }

};
// exporting the actual object
module.exports = exports;