## TODO 
# GameApi

### Wichtige Funktionen
Folgende Funktionen müssen vor dem Spiel implementiert werden (im aktuellen Layout in der 3dgame.js):

```javascript
gameApi.frontendInboundMessage = function(controllerData){
 // Hier muss die Spiellogik implementiert werden, falls neue Daten vom Controller Template kommen
}
```
### Initialisierung der API
Sind die Funktionen gesetzt, wird die API folgendermaßen initialisiert:
```
var socketHandle = gameApi.init();
if (socketHandle !== -1) {
 // Game Implementierung
}
```
- Ist die Initialisierung der Api erfolgreich, gibt die init()-Funktion die Session zurück. 
Im Fehelrfall wird ```-1``` zurückgegeben

### Optional
Die folgenden Variablen müssen nicht gesetzt werden. Das Controllerlayout steht standardmäßig auf ```.DEMO``` und das logLevel auf ```.DEBUG```
```javascript

gameApi.logLevel = gameApi.log.DEBUG;
gameApi.controller = gameApi.controllerTemplates.MODERN;
```

```javascript
var socketHandle = gameApi.init();
```

### Beispiel
```javascript
/**
 * Handle new Controller Data
 * @param controllerData
 */
gameApi.frontendInboundMessage = function (controllerData) {
    console.log("on.FrontendInboundMessage: ", controllerData);
    var msgDetails = typeof controllerData.data.message === "object" ? JSON.stringify(controllerData.data.message) : controllerData.data.message;
    gameApi.addLogMessage('client', controllerData.data.clientName + ': ' + msgDetails);


if (controllerData.type == "button" && controllerData.data.message === gameApi.BUTTON.DOWN) {
        var a = 200 * Math.random();
        var b = 200 * Math.random();
        var c = 200 * Math.random();

        GameHandler.adjustCubeSize(0, {x: a, y: b, z: c});
    }
};

/**
 *
 * @type {number}
 */
gameApi.logLevel = gameApi.log.DEBUG;
gameApi.controller = gameApi.controllerTemplates.MODERN;

var socketHandle = gameApi.init();
if (socketHandle !== -1) {
 // Game Implementierung
}
```