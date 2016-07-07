# Node Server
The underlying Node.js Server application has been developed with the [Node Express Framework](http://expressjs.com/) also known as Express.js.
This server framework extents Node.js by an easy to use full webserver application with a number of extensions similar to Node.js.
The central run a

## app.js
Starts the application and sets up application runtime variables. ```app.set('property', {value})```

## www.js
Starts the webserver and includes and starts application based modules like **Keymapping** and **sessionHandling**.

## config.json
The [config.json](../config.json) is a self written config file for central configuration of the server.
