/**
 * Created by dennis on 29.10.15.
 */
var MongoClient = require('mongodb').MongoClient;

module.exports = function(dbURL){
    this.dbURL = dbURL;
    this.db = undefined;

    ///////////////////////
    //Connect to database
    ///////////////////////
    openDB = function(onSuccess){
        MongoClient.connect(dbURL, function(error, db) {
            if(error == null){
                this.db = db;
                onSuccess(db);
                console.log("Connected to server!");
            } else {
                console.log(error);
            }

        });
    };

    ///////////////////////
    //Close database connection
    ///////////////////////
    closeDB = function(){
        db.close();
    };

    ///////////////////////
    //Public
    ///////////////////////
    publicSection = {
        insert:function(collection, data) {
            openDB(function(db) {
                var userCollection = db.collection(collection);

                //Insert into the collection
                userCollection.insertOne(
                    data,
                    function (error, doc) {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log("Add to DB: " + data);
                        }
                        closeDB();
                });
            });
        },

        query:function(collection, query, onSuccess) {
            openDB(function(db) {
                var userCollection = db.collection(collection);
                userCollection.find(query).toArray(function(err, docs){
                    onSuccess(docs);
                    closeDB();
                });
            });
        }
    };
    return publicSection;
};