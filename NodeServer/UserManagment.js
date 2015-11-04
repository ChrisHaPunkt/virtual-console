/**
 * Created by dennis on 29.10.15.
 */



function UserManagment(){
    this.database = new database("mongodb://localhost:27017/M113");
    this.userCollection = "userData";

    var publicSection = {
        addUser:function(name, password){
            User = {name:name, password:password};
            database.insert(this.userCollection, User);
        },


        authenticateUser:function(name, password){
            query = { name:name, password:password};
            var onSuccess = function(){console.log("Login successfuly");};
            database.query("userData", query, onSuccess);

        },


        setUserData:function(){},
        getUserData:function(){}
    }
    return publicSection;

}