/**
 * Created by dennis on 29.10.15.
 */

var MongoClient = require('mongodb').MongoClient;


function database(dbURL){
    this.dbURL = dbURL;
    this.db = undefined;

    ///////////////////////
    //Connect to Database
    ///////////////////////
    openDB = function(onSuccess){
        MongoClient.connect(dbURL, function(err, db) {
            if(err == null){
                this.db = db;
                onSuccess(db);
                console.log("Connected correctly to server.");
            } else {
                console.log(err);
            }

        });
    }

    ///////////////////////
    //Connect to Database
    ///////////////////////
    closeDB = function(){
        db.close();
    }


    ///////////////////////
    //Public
    ///////////////////////
    public = {
        insert:function(collection, data) {
            openDB(function(db) {
                var userCollection = db.collection(collection);

                //Insert into the collection
                userCollection.insertOne(
                    data,
                    function (error, doc) {
                        if (error) {
                            // If it failed, return error
                            console.log(error);
                        }
                        else {
                            // And forward to success page
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

    }

return public;

}






//For test purpose
mongodb = new database("mongodb://localhost:27017/M113");
mongodb.insert("userData", { name:"test"});
mongodb.query("userData", { name:"test"},function(docs){console.log(docs);});