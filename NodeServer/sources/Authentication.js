/**
 * Created by dennis on 29.10.15.
 */

var database = require("Database.js");

function authentication(){
    this.database = new database("mongodb://localhost:27017/M113");

    publicSection = {
        check:function(userName, userPass){
            query = { "name":user, "password":userPass};
            onSuccess = function(){console.log("Login successfuly");};
            database.query("userData", query, onSuccess);
        }
    };
    return publicSection;
}