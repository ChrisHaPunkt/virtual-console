/**
 * Created by chrisheinrichs on 03.05.16.
 */

var config = require('../../config.json');
var database = require('./Database')();
var debug = config.debug;
var GameVO = require("./ValueObjects/GameVO");
var util = require('util');
var os = require("os");

var exec = require('child_process').exec;

/**
 * Execute from Project Root a command
 * @param command
 * @param callback
 */
function execute(command, callback) {
    exec("cd " + __dirname + "/../../ && " + command, function (error, stdout, stderr) {
        callback(stdout, stderr);
    });
}

/**
 * Stoppe die NodeJS Applikation und die Datenbank
 * @param onSuccess
 */
var shutdownFullApplication = function (callback) {

    execute('/bin/bash ./app.sh stop', function (stdout, stderr) {

        if (typeof callback == "function") {
            callback(stdout, stderr);
        }
    });
};
/**
 * Stoppe die Datenbank
 * @param onSuccess
 */
var shutdownDatabase = function (onSuccess) {

    execute('/bin/bash scripts/database.sh stop', function (stdout, stderr) {

        if (typeof callback == "function") {
            callback(stdout, stderr);
        }
    });
};
/**
 * Starte die Datenbank
 * @param onSuccess
 */
var startDatabase = function (onSuccess) {

    execute('/bin/bash scripts/database.sh start', function (stdout, stderr) {

        if (typeof callback == "function") {
            callback(stdout, stderr);
        }
    });
};

var shutdownSystem = function (callback) {

    execute('shutdown -P now', function (stdout, stderr) {

        if (typeof callback == "function") {
            callback(stdout, stderr);
        }
    });
};

/**
 *
 * @param callback
 * reutn array of GameVO
 */
var restartSystem = function (callback) {

    execute('shutdown -r now', function (stdout, stderr) {

        if (typeof callback == "function") {
            callback(stdout, stderr);
        }
    });

};

/**
 * EXPORT OBJECT / PUBLIC INTERFACE
 * */
var exports = {


    shutdown: function (callback) {
        shutdownFullApplication(function () {

            shutdownSystem(callback);
        });
        return this;
    },

    restart: function (callback) {

        shutdownFullApplication(function () {

            restartSystem(callback);
        });
        return this;
    }

};
// exporting the actual object
module.exports = exports;