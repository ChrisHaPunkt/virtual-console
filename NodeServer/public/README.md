# Public Directory
The public directory ```../NodeServer/public/``` is exposed by the Node Server ([app.js line 95](https://gitlab.homeset.de/fhKiel/virtual-console/blob/master/NodeServer/app.js#L95)) and can be accessed by the frontend and the controller clients.
Therefore it contains the sources and assets for the **controller**, the **games** and the **GameAPI**, the **main menu** and additional **libraries** used by the said components.

It's important to notice that the HTML Template files for the components are not stored within this directory because their are rendered and handed out by the webserver upon connection from a client. Therefore they are not directly accessible from public.

From these files the **GameAPI** is the most important one for developers who want to develop their own games for the *virtual console*.

All of the client sided files use [RequireJS](http://requirejs.org/) to manage file imports.

# Controller
## ControllerMain
The file [controllerMain.js](https://gitlab.homeset.de/fhKiel/virtual-console/blob/master/NodeServer/public/js/controllerJS/controllerMain.js) is inserted into the controller main HTML Template and contains the most important functionalities used by all of the controllers. By now there are no controller specific Javascript files. Unlike the stylesheets where besides a central main CSS file each controller maintains its own styles. These stylesheet files are only loaded by the clients when needed.
## ClientNetwork
Another important files is the [clientNetwork.js](https://gitlab.homeset.de/fhKiel/virtual-console/blob/master/NodeServer/public/js/controllerJS/clientNetwork.js) which contains the network logic for the controller client. The file is imported and used by the ```controllerMain.js```. The network module builds up a connection to the server and handles incoming and outgoing messaging.
 
# GameAPI (FrontendNetwork)
The [gameApi.js](https://gitlab.homeset.de/fhKiel/virtual-console/blob/master/NodeServer/public/js/gameApi.js) acts as the central component of all the different frontends. It combines the **network logic**, the **overlay menu**, **QR code** handling, **performance measurement** and a **logging** functionality.
Every game that is programmed for the virtual console has to import and use the **GameAPI**. 

## Most important attributes
The API allows to setup preferences for the game.
```JavaScript
gameApi.logLevel = gameApi.log.INFO;
gameApi.controller = gameApi.controllerTemplates.MODERN;
```

## Most important methods

```JavaScript
gameApi.frontendInboundMessage = function(msg){
 // Represents the most important function to be overwritten. It is called each time the frontend/game receives a message from the server.
 // Messages are player/game related information and should be used to control the game.
}
```
```JavaScript
gameApi.frontendInboundData = function(msg){
 // Might also be overwritten. It is called each time the frontend/game receives data from the server. 
 // It is currently **unused** and should only be used to handle internal, game-unrelated commands.
}
```
After setting up the configuration and overwriting the specific messaging functions the gameAPI is initiated by the following command.
This function builds up the socket connection to the server and initiates the frontend UI. Upon successful initiation the callback method is called if provided.
The return value is the socket connection to the server or ```-1``` in case of error. This should only be used in rare cases.
```JavaScript
var socket = gameApi.init(callback);
```

To send outgoing messages or requests the following two methods should be used
```JavaScript
// used to send game specific messages to the server
gameApi.sendToServer_Message('messageType', message);
// used to send data and commands to the server
gameApi.sendToServer_Data('requestType', {data}, callback);
```

After game initialization the server needs to know that the game has started completely by using following method call.
```JavaScript
gameApi.tellServerGameIsStarted();
```

### Example
```JavaScript
gameApi.frontendInboundMessage = function (data) {
    console.log("on.FrontendInboundMessage: ", data);
    var msgDetails = typeof data.data.message === "object" ? JSON.stringify(data.data.message) : data.data.message;
    gameApi.addLogMessage('client', data.data.clientName + ': ' + msgDetails);

if (data.type == "button" && data.data.message === gameApi.BUTTON.DOWN) {
        var a = 200 * Math.random();
        var b = 200 * Math.random();
        var c = 200 * Math.random();
        GameHandler.adjustCubeSize(0, {x: a, y: b, z: c});
    }
};

gameApi.logLevel = gameApi.log.DEBUG;
gameApi.controller = gameApi.controllerTemplates.MODERN;

var socketHandle = gameApi.init();
if (socketHandle !== -1) {
 // Game implementation
 gameApi.sendToServer_Message('type_hello', 'Hello Server!);
 gameApi.sendToServer_Data('data_type', {some:data}, function(returnData){
    console.log('the server returned data! ', returnData);
 });
 gameApi.
}
```

# Games
All of the following components use the **GameAPI**.
## Main Menu
Upon start the virtual console application opens the main menu in the frontend. It contains a list of all set up games from which the user can navigate to the desired one.
## Internal Games
Internal games a specific written games using the **gameAPI**. They run on the server.
## External Games
External games can be any public games in the internet that run in a browser and are **controlled via keyboard** inputs. Currently only JavaScript games have been tested.
A new game can be configured by opening the input dialog in the main menu. The provided game URL is embedded in an iFrame in the 'external games' route.

# Libraries
The frontend and controller use a number of different libraries:
* [chartJS](http://chartjs.org/)
* [jQuery](http://jquery.com/)
* [jQuery Mobile](https://jquerymobile.com/)
* [noty (jQuery)](http://ned.im/noty)
* [phaser.io](http://phaser.io/)
* [qrcode.js](https://davidshimjs.github.io/qrcodejs/)
* [RequireJS](http://requirejs.org/)
* [socket.io](http://socket.io/)
* [three.js](http://threejs.org/)