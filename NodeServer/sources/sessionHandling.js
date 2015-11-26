/**
 * Created by hannes on 10.11.2015.
 */

var network = require('../sources/serverNetwork.js');
var userManagement = require('../sources/UserManagement.js')();
var util = require('util');

var activeUsers = {};
var server = 0;
var callback = 0;
var currentAnonymousUserId = 0;

var addUser = function (id) {
    activeUsers[id] = {socketId: id, userName: 0, isLoggedIn:false, isAuthenticated:false};
};

var setUserName = function (id, userName) {
    activeUsers[id].userName = userName;
};
var setUserStatus = function(id,login,auth){
    activeUsers[id].isLoggedIn = login;
    activeUsers[id].isAuthenticated = auth;
};

var isLoggedIn = function (id) {
    return activeUsers[id].isLoggedIn;
};

var removeUserByName = function (userName) {
    var tmpUserId = getUserIdByName(userName);
    if (tmpUserId) {
        removeUserById(tmpUserId);
    }
};

var removeUserById = function (id) {
    if (activeUsers.hasOwnProperty(id)) {
        delete activeUsers[id];
    }
};

var getUserById = function (id) {
    return activeUsers[id];
};

var getUserIdByName = function (userName) {
    for (var tmpUserId in activeUsers) {
        if (activeUsers.hasOwnProperty(tmpUserId)) {
            if (activeUsers[tmpUserId].userName === userName) {
                return tmpUserId;
            }
        }
    }
    return false;
};

var startNetworkServer = function (server) {
    network.init(server, {
        onNewClient: function (id) {
            addUser(id);
        },
        onRegister: function (id,username,password) {
            userManagement.registerUser(username,password,function(result){
                if(result){
                    return {result:true,username:username};
                }else{
                    //network.sendToClient(id,'register',false);
                    return {result:true,username:username};
                }
            });
            return true;
        },
        onLogin: function (id, username, password) {
            userManagement.authenticateUser(username,password,function(result){
                if(result){
                    setUserName(id,username);
                    setUserStatus(id,true,true);
                    callback.onNewUser(username);
                    return {result:true,username:username};
                }else{
                    return {result:false,username:username};
                }
            });
        },
        onAnonymousLogin: function(id){
            var tmpUserName = "User_"+ ++currentAnonymousUserId;
            setUserName(id, tmpUserName);
            setUserStatus(id,true,false);
            callback.onNewUser(tmpUserName);
            return {result:true,username:tmpUserName};
        },
        onDisconnect: function (id) {
            callback.onUserDisconnects(getUserById(id).userName);
            removeUserById(id);
        },
        onMessage: function (id, type, data) {
            if(isLoggedIn(id)) {
                callback.onMessage(getUserById(id).userName, type, data);
            }else{
                util.error('sessionHandler | user id ' + id + ' send message without being authenticated.');
            }
        }
    }).start();
};

// exports
module.exports = {
    init: function (inServer, inCallback) {
        server = inServer;
        callback = inCallback;
        return this;
    },
    start: function () {
        startNetworkServer(server);
        return this;
    },
    sendToUser: function(name,type,message){
        network.sendToClient(getUserIdByName(name),type,message);
    },
    removeUser: function (name) {
        removeUserByName(name);
        network.disconnectClient(getUserIdByName(name));
    },
    setUserData: function(name,data){
        //TODO set userdata in usermanagement
    },
    getUserData: function(name,data){
        //TODO get userdata from usermanagement
    },
    sendToFrontend: function(type, message){
        network.sendToFrontend(type,message);
    }
};