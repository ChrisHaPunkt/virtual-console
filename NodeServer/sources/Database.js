/**
 * Created by dennis on 29.10.15.
 */
var MongoClient = require('mongodb').MongoClient;

module.exports = function(dbURL){
    this.dbURL = dbURL;

    ///////////////////////
    //Connect to database
    ///////////////////////
    var openDB = function(onSuccess){
        MongoClient.connect(dbURL, function(error, db) {
            if(error == null){
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
   var closeDB = function(db){
        db.close();
    };

    ///////////////////////
    //Public
    ///////////////////////
    var publicSection = {

        /***************************************
         * Remove data from the collection
         ***************************************/
        remove:function(collection, query) {

            var dbID = undefined;
            var removeCallback = function(err, results) {
                closeDB(dbID);
            };

            openDB(function(db) {
                dbID = db;
                var userCollection = db.collection(collection);
                userCollection.deleteMany(query, removeCallback);
            });

        },


        /*************************************
         * Insert into Database
         *************************************/
        insert:function(collection, data) {
            var dbID = undefined;
            console.log(data);

            var insertCallback = function(error, doc) {
                if (error) {
                    console.log(error);
                } else {

                    console.log("Add to DB: ", data);
                }
                closeDB(dbID);
            };

            //Insert into database
            openDB(function(db) {
                dbID = db;
                var userCollection = db.collection(collection);
                userCollection.insertOne(data, insertCallback);
            });
        },


        /****************************************
         * Update a database entry
         ***************************************/
        update:function(collection, filter, data, callback){



            //Open connection and update the entry specified by the filter object
            openDB(function(db) {
                dbID = db;
                var userCollection = db.collection(collection);
                userCollection.updateOne(filter, { $set: data }, callback);
            });
        },


        /****************************************
         * Database query
         ***************************************/
        query:function(collection, query, onSuccess) {
            var dbID = undefined;
            var queryCallback = function(err, docs){
                onSuccess(docs);
                closeDB(dbID);
            };

            openDB(function(db) {
                dbID = db;
                var userCollection = db.collection(collection);
                userCollection.find(query).toArray(queryCallback);
            });
        }
    };
    return publicSection;
};