/**
 * Created by dennis on 29.10.15.
 */

//var database = require('./Database.js')("mongodb://84.200.213.85:5223/M113");
var database = require('./Database.js')("mongodb://localhost/M113");

module.exports = function(){
    var debug = true;


    var publicSection = {

        /**************************************
         * Register a user
         **************************************/
        registerUser:function(name, password, callback) {
            var User = { name:name, password:password };
            var query = { name:name };

            var registerCallback = function(state){
                //Only register a new user when he is unique
                if (state == 0) {
                    database.insert("userData", User, callback);
                } else {
                    callback(false, "User already exist!");
                }
            };

            database.query("userData", query, registerCallback);
        },


        /********************************************
         * Authenticate a user
         ********************************************/
        authenticateUser:function(name, password, callback) {
            var query = { name:name, password:password };

            var onSuccess = function(data) {
                var returnState = false;
                var returnMsg = "";

                if (data.length == 1) {
                    returnMsg = "Login successfully!";
                    returnState = true;
                } else if (data.length == 0) {
                    returnMsg = "Login failed!";
                } else {
                    returnMsg = "Database error: Found to many users!";
                }

                if (debug) console.log("UserManagement | " + returnMsg);
                callback(returnState, returnMsg);
            };
            database.query("userData", query, onSuccess);
        },


        /********************************************
         * Set user data
         ********************************************/
        setUserData:function(userName, data, onSuccess) {
            var query = { name:userName };

            var callback = function(state, msg){
                //The user exist
                if (state == true && msg[0]){
                    console.log(msg[0]);
                    msg[0]["data"] = data;
                    database.update("userData", query, msg[0]);
                }
            };
            database.query("userData", query, callback);
        },


        /********************************************
         * Get user data
         ********************************************/
        getUserData:function(userName, onSuccess){
            var query = { name:userName };

            var queryCallback = function(state, msg){
                //The user exist
                if (state == true && msg[0]){
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