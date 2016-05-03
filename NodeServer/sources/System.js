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

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
}




var shutdownSystem = function (onSuccess) {

    execute('/usr/bin/node /home/odroid/virtual-console/app.sh stop', function(callback){
    //execute('shutdown -P now', function(callback){
        console.log(callback);
    });
    if(typeof onSuccess == "function"){
        onSuccess();
    }
};

/**
 *
 * @param onSuccess
 * reutn array of GameVO
 */
var restartSystem = function (onSuccess) {

    execute('shutdown -r now', function(callback){
        console.log(callback);
    });

    if(typeof onSuccess == "function"){
        onSuccess();
    }
};

/**
 * EXPORT OBJECT / PUBLIC INTERFACE
 * */
var exports = {


    shutdown: function (callback) {
        shutdownSystem(callback);
        return this;
    }

};
// exporting the actual object
module.exports = exports;