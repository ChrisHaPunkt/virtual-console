/**
 * Created by chris on 19.04.2016.
 */
var config = require('../../config.json');
var database = require('./Database')();
var debug = config.debug;

var persitNewRoute = function (RouteVO, callback) {

    if(RouteVO.validate()){
        database.insert("userData", RouteVO, callback);
    }else{

        callback(false, "User already exist!");
    }
    var query = {name: name};


    if (name.length == 0 || password.length == 0) {
        callback(false, "User name or password is empty!");
        console.log(name.length, password.length);

    } else {
        database.query("userData", query, registerCallback);
    }

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

    addNewRoute: function (TYPE, callback) {

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