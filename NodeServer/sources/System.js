/**
 * Created by chrisheinrichs on 03.05.16.
 */

var config = require('../../config.json');
var database = require('./Database')();
var debug = config.debug;
var GameVO = require("./ValueObjects/GameVO");
var util = require('util');
var os = require("os");
var tcpPortUsed = require('tcp-port-used');

var exec = require('child_process').exec;
var child_process = require('child_process');

/**
 * Execute from Project Root a command
 * @param command
 * @param callback
 */
function execute(command, callback) {
    var isWin = /^win/.test(process.platform);
    var s = (isWin) ? "\\..\\..\\" : "/../../";
    var executed = "cd " + __dirname + s + " && " + command + "";
    util.log("Try to execute: " + executed);

    //  create_child(command);
    exec(executed, function (error, stdout, stderr) {
        util.log(stdout, stderr);
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
 * @param started
 */
var startDatabase = function (onSuccess) {
    try {
        var childProcess = child_process.exec('mongod --port 27111 --dbpath Database/storage &', function (err, stdout, stderr) {
            util.log(stdout)

        });
        if (typeof onSuccess == "function")
            onSuccess();
        // util.log(childProcess)
    } catch (e) {
        util.log(e)
    }
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

    handlingDB: false,
    startDatabase: function (onStarted) {

        this.guaranteeDatabase(onStarted);

        return this;

    },
    guaranteeDatabase: function (started) {
        if (!this.handlingDB) {
            this.handlingDB = true;
            //Test if a mongoinstance running:
            var that = this;
            tcpPortUsed.check(parseInt(config.dbport)).then(function (inUse) {
                console.log('Port ' + config.dbhost + ':' + config.dbport + ' usage: ' + inUse);
                if (inUse) {
                    util.log("DB running ");

                } else {
                    util.log("Start db " + process.cwd());
                    startDatabase(function (succ) {
                        util.log("db started");
                        that.handlingDB = false;
                        if (typeof started == "function")
                            started();
                        var inUse = true;   // wait until the port is in use

                    })
                }
            }, function (err) {
                console.error('Error on check:', err.message);
            })
        } else {
            tcpPortUsed.waitUntilUsed(parseInt(config.dbport), 500, 4000)
                .then(function () {
                    started();
                    console.log('Port ' + config.dbport + ' is now in use.');
                }, function (err) {
                    console.log('Error:', err.message);
                });

        }
    },
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