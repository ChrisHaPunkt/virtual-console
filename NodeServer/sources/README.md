# Classes

## Database
MongoDB database handling. Here the database connection is build up and basic CRUD operations are encapsulated in eady to use methods.

## Games
**TODO @chrish**

## Keymapping
**TODO @michaels**

## System
Basic system commands for database handling (start/stop), node application shutdown, system shutdown and restart.

## serverNetwork
```
WARNING The interface of the serverNetwork should never be used directly on the server site but only by the sessionHandling as an abstraction layer.
```
The ```serverNetwork.js``` is the basic network class of the server. Here the incoming socket connections from the different clients (frontend and controller clients) are handled and managed. When a new client connects it gets assigned a random ID and is saved in the list of known clients. At this point is its not known if the client is the frontend or any of the controller clients. If a socket connection is terminated the client is deleted from the list of known clients.
On this level the native socket event types of the socket.io library are used to differentiate the incoming messages from the clients. Depending on the message type different methods from the next logical layer the ```sessionHandling.js``` are called. So these two classes build up a **two layer architecture** for managing client connections and messaging with the server.
Also basical outgoing messaging functions like ```sendToClient()```, ```sendToFrontend()``` and ```broadcastMessage()``` are implemented and can be used by the ```sessionHandling```.

## sessionHandling
The ```sessionHandling.js``` represents the next higher level of message and client handling. Here the link between socket connection and user management is made. Therefor a list of ```activeUsers``` is maintained containing informations about all active users being authenticated or anonymous.
A user is represented in the list by following data structure:
```javascript
var user = {
    socketId: id,
    userName: 0,
    isLoggedIn: false, // logged in in general
    isAuthenticated: false // authenticated or anonymous user
}
```
The sessionHandling handles **incoming messages** passed from the ```serverNetwork``` from different sources.
```javascript
onMessage(id, type, data, callbackFromClient, callbackFromServerNetwork){
    // Any incoming message or data-command from the controller clients are processed here
}
onFrontendConnected(){
    // Whenever a frontend connects or reloads a list of active user clients is passed to the frontend.
    // The information is further passed to the next layer ```www.js```
}
onFrontendOutboundMessage(type, message){
    // Any incoming game messages are received here and are at the moment passed to the next layer ```www.js``` where the server is initiated.
    // The message processing could also take place here depending on the message types. (e.g. direct passing of game information to the clients)
}
onFrontendOutboundData(request, data, callbackFromClient){
    // Called when the frontend sends 'data' representing a command or request to the server. These commands are directly processed in the ```sessionHandling.js```
}
```

The sessionHandling also provides an interface to the next layer to handle the active users or send messages to the users and the frontend. Also the server is started by calling the ```init()``` and ```start()``` functions once.
```javascript
    init: function (inServer, inCallback) {
        // inits server settings
    },
    start: function () {
        // starts the server
    },
    sendToUser: function (name, type, message) {
        // sends a message to a single user
        // the TYPE is not a socket.io event any more but represents an abstracted message type that can be determined by the programmer
    },
    broadcastMessage: function (type, data) {
        // broadcasts a message to all users
        // the TYPE is not a socket.io event any more but represents an abstracted message type that can be determined by the programmer
    },
    removeUser: function (name) {
    },
    getUserList: function () {
    },
    setUserData: function (name, data) {
        // NOT YET IMPLEMENTED
        //sets userdata in usermanagement
    },
    getUserData: function (name, data) {
        // NOT YET IMPLEMENTED
        //gets userdata from usermanagement
    },
    sendToFrontend_Message: function (clientName, messageType, message) {
        // sends a (game)message to the frontend
    },
    sendToFrontend_Data: function (type, msg) {
        // sends data or commands to the frontend
    }
```

## UserManagement
The ```UserManagement.js``` handles the user registration and authentication.  It uses the ```Database.js``` to connect to the MonoDB and read from the user files.