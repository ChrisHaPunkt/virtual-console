/**
 * Created by dennis on 29.10.15.
 */
var MongoClient = require('mongodb').MongoClient;
var config = require('../../config.json');
module.exports = function () {

    var dbURL = "mongodb://" + config.dbhost + ":" + config.dbport + "/" + config.dbcollection
    var debug = config.debug;
    this.dbURL = dbURL;

    /***************************************
     * Connect to database
     ***************************************/
    var openDB = function (onSuccess) {
        MongoClient.connect(dbURL, function (error, db) {
            if (error) {
                console.log(error);
            } else {
                // if (debug) console.log("Connected to Database!");
                onSuccess(db);
            }

        });
    };


    /***************************************
     * Close database connection
     ***************************************/
    var closeDB = function (db) {
        // if (debug) console.log("Disconnected from Database!");
        db.close();
    };


    /***************************************
     * Public section
     ***************************************/
    var publicSection = {

        /***************************************
         * Remove all elements, which are selected by the filter object, from the database.
         ***************************************/
        remove: function (collection, filter, callback) {
            var dbID = undefined;
            if (!callback) callback = function () {
            };

            var removeCallback = function (error, doc) {
                if (error) {
                    if (debug) console.log(error);
                    callback(false, error);
                } else {
                    if (debug) console.log("Database | Remove from DB: ", filter);
                    callback(true, doc);
                }
                closeDB(dbID);
            };

            openDB(function (db) {
                dbID = db;
                var userCollection = db.collection(collection);
                userCollection.deleteMany(filter, removeCallback);
            });
        },


        /*************************************
         * Insert a element into the database
         *************************************/
        insert: function (collection, data, callback) {
            var dbID = undefined;
            if (!callback) callback = function () {
            };

            var insertCallback = function (error, doc) {
                if (error) {
                    if (debug) console.log(error);
                    callback(false, error);
                } else {
                    if (debug) console.log("Database | Add to DB: ", data);
                    callback(true, doc);
                }
                closeDB(dbID);
            };

            //Insert into database
            openDB(function (db) {
                dbID = db;
                var userCollection = db.collection(collection);
                userCollection.insertOne(data, insertCallback);
            });
        },


        /****************************************
         * Update a database element
         ***************************************/
        update: function (collection, filter, data, callback) {
            var dbID = undefined;
            if (!callback) callback = function () {
            };

            var updateCallback = function (error, doc) {
                if (error) {
                    if (debug) console.log(error);
                    callback(false, error);
                } else {
                    if (debug) console.log("Database | Update element: ", data);
                    callback(true, doc);
                }
                closeDB(dbID);
            };

            //Open a connection and update the entry specified by the filter object
            openDB(function (db) {
                dbID = db;
                var userCollection = db.collection(collection);
                userCollection.updateOne(filter, {$set: data}, updateCallback);
            });
        },


        /****************************************
         * Database query
         ***************************************/
        query: function (collection, query, callback) {
            var dbID = undefined;
            if (!callback) callback = function () {
            };

            var queryCallback = function (error, doc) {
                if (error) {
                    if (debug) console.log(error);
                    callback(false, error);
                } else {
                    if (debug) console.log("Database | Query successfully!");
                    callback(true, doc);
                }
                closeDB(dbID);
            };

            openDB(function (db) {
                dbID = db;
                var userCollection = db.collection(collection);
                userCollection.find(query).toArray(queryCallback);
            });
        }
    };
    return publicSection;
};