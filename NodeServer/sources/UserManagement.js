/**
 * Created by dennis on 29.10.15.
 */

var database = require('./Database.js')("mongodb://84.200.213.85:5223/M113");

module.exports = function(){

    var userList = [];
    //SendUser


    var publicSection = {

        getSocketID:function(user) {

        },

        registerUser:function(socketID, name, password) {   //Dummy function
            //User = {name:name, password:password};
            //database.insert("userData", User);
        },

        authenticateUser:function(name, password) {
            query = { name:name, password:password };
            var onSuccess = function(){console.log("Login successfuly");};
            database.query("userData", query, onSuccess);

        },

        setUserData:function(){},
        getUserData:function(){}
    };
    return publicSection;

};