/**
 * Created by dennis on 29.10.15.
 */

var config = require('../../config.json');
var database = require('./Database.js')();
var Keymapping = require('./Keymapping');

var debug = config.debug;
var util = require('util');

module.exports = function () {
    var debug = config.debug;

    var publicSection = {

        /**************************************
         * Register a user
         **************************************/
        registerUser: function (name, password, callback) {
            var User = {name: name, password: password, keymapping: {}};
            var query = {name: name};

            var registerCallback = function (state, data) {
                //Only register a new user when he is unique
                if (state && data.length == 0) {
                    database.insert("userData", User, callback);

                } else {

                    callback(false, "User already exist!");
                }
            };

            if (name.length == 0 || password.length == 0) {
                callback(false, "User name or password is empty!");
                if (debug) util.log(name.length, password.length);

            } else {
                database.query("userData", query, registerCallback);
            }

        },


        /********************************************
         * Authenticate a user
         ********************************************/
        authenticateUser: function (name, password, callback) {
            var query = {name: name, password: password};

            var onSuccess = function (state, data) {
                var returnState = false;
                var returnMsg = "";
                if (state && data.length == 1) {
                    returnMsg = "Login successfully!";
                    returnState = true;
                } else if (state && data.length == 0) {
                    returnMsg = "Login failed!";
                } else {
                    returnMsg = "Database error: Found to many users! (" + data + ")";
                }

                if (debug) util.log("UserManagement | " + returnMsg);
                callback(returnState, returnMsg);
            };
            database.query("userData", query, onSuccess);
        },


        /********************************************
         * Set user data
         ********************************************/
        setUserData: function (userName, data, onSuccess) {
            var query = {name: userName};

            var callback = function (state, msg) {
                //The user exist
                if (state == true && msg[0]) {
                    if (debug) util.log(msg[0]);
                    msg[0]["data"] = data;
                    database.update("userData", query, msg[0]);
                }
            };
            database.query("userData", query, callback);
        },


        /********************************************
         * Get user data
         ********************************************/
        getUserData: function (userName, onSuccess) {
            var query = {name: userName};

            var queryCallback = function (state, msg) {
                //The user exist
                if (state && msg[0]) {
                    onSuccess(true, msg[0].data);
                } else {
                    onSuccess(false, msg);
                }
            };
            database.query("userData", query, queryCallback);
        }
    };
    return publicSection;

};