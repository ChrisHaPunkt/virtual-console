/**
 * Created by dennis on 29.10.15.
 */

var database = require('./Database.js')("mongodb://84.200.213.85:5223/M113");

module.exports = function(){

    var publicSection = {


        /**************************************
         * Register a user
         **************************************/
        registerUser:function(name, password, callback) {
            var User = {name:name, password:password};

            var registerCallback = function(authState){

                //Only register a new user when he is unique
                if (authState == false) {
                    database.remove("userData", User);
                    database.insert("userData", User);
                }
            };

            this.authenticateUser(name, password, registerCallback);
        },


        /********************************************
         * Authenticate user
         ********************************************/
        authenticateUser:function(name, password, callback) {
            var query = { name:name, password:password };


            var onSuccess = function(data){
                var returnState = false;
                if (data.length == 1){
                    returnState = true;
                    console.log("Login successfully!");
                } else if (data.length == 0) {
                    console.log("Unknown User/Password!");
                } else {
                    console.log("Login error!");
                }
                callback(returnState);
            };

            database.query("userData", query, onSuccess);

        },

        setUserData:function(){},
        getUserData:function(){}
    };
    return publicSection;

};