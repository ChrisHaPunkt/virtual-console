define(['/socket.io/socket.io.js'], function (io) {

    var gameApi = {

        /**
         * ID of the log containing DOM-Element
         * @type {string}
         */
        logContainer: 'log',
        log: {
            NONE: 1,
            INFO: 2,
            DEBUG: 3
        },
        controllerTemplates: {
            DEMO: 4,
            NEW: 5,
            MODERN: 6
        },
        BUTTON: {
            UP: 7,
            DOWN: 8
        },
        logLevel: null,
        socket: null,
        performanceMonitor: false,
        pageLogContent: null,
        frontendConnectionOutbound: null,
        frontendConnection: null,
        frontendInboundMessage: null,
        controller: null,
        chart: {},
        init: function () {

            // set log level to info if not set by game
            if (this.logLevel === null)
                this.logLevel = this.log.INFO;

            // set controller template to demo if not set by game
            if (this.controller === null)
                this.controller = this.controllerTemplates.DEMO;

            /**
             * Build up a connection to server
             *
             * This is done by a handshake
             *
             * Client -> Server : 'frontendInit'
             * Server -> Client : 'frontendConnection'
             */

            // open socket connection to server - the origin ip of the http files is used if not specified
            this.socket = io.connect();

            // send init request when socket is connected
            this.socket.on('connect', function () {
                this.socket.emit('frontendInit', {});
            }.bind(this));

            // handshake with server was successful
            this.socket.on('frontendConnection', function (incomingMessage) {
                this.addLogMessage(this.log.INFO, 'conn', incomingMessage + " " + this.socket.id);
                this.sendControllerTemplateToServer();
            }.bind(this));

            /**
             * README
             *
             * In order to be called in the right context when a socket event occurs the passed function is bound to 'this', otherwise the context would be the socket object and not the game api.
             * http://stackoverflow.com/questions/5221978/how-to-bind-the-event-handler-of-socket-io-in-nodejs-to-my-own-scope
             * http://stackoverflow.com/questions/15455009/javascript-call-apply-vs-bind
             */

            /**
             * Handle incoming messages
             */
            if (this.frontendInboundMessage !== null)
                this.socket.on('frontendInboundMessage', this.onIncomingMessage.bind(this));
            else return -1;

            /**
             * INIT END
             * */
            this.addLogMessage(this.log.INFO, "init", "Game Api successfully Initialized");
            return this.socket;
        },

        /**
         * HELPER FUNCTION
         * */
        // write to log container in DOM
        addLogMessage: function (level, type, msg) {
            var pageLogContent = document.getElementById(this.logContainer);
            // if log level is DEBUG log everything
            if (this.logLevel === this.log.DEBUG) {
                console.log(type + ": " + msg);
                // additional log INFO levels to UI
                if (level === this.log.INFO) {
                    pageLogContent.innerHTML = '<p class="message"><span class="messageType">' + type + ': </span><span class="messageContent">' + msg + '</span></p>' + pageLogContent.innerHTML;
                }
                // if log level is INFO just log INFO logs
            } else if (this.logLevel === this.log.INFO && level === this.log.INFO) {
                console.log(type + ": " + msg);
                pageLogContent.innerHTML = '<p class="message"><span class="messageType">' + type + ': </span><span class="messageContent">' + msg + '</span></p>' + pageLogContent.innerHTML;
            }
        },

        /**
         * INCOMING COMMUNICATION
         * */
        onIncomingMessage: function (data) {
            // pass data to function defined by game
            this.frontendInboundMessage(data);
        },

        /**
         * OUTGOING COMMUNICATION
         * */
        sendToServer: function (messageType, message) {
            if (this.socket != null) {
                this.socket.emit('frontendOutboundMessage', {type: messageType, data: message});
            } else {
                this.addLogMessage(this.log.DEBUG, 'error', 'No server connection. Please initiate. \'init()\'');
            }
        },

        sendControllerTemplateToServer: function (template) {
            if (template) {
                // a new template can be passed to the function before sending it to the server
                this.controller = template;
            }
            if (this.controller) {
                this.sendToServer('setControllerTemplate', this.controller);
            } else {
                this.addLogMessage(this.log.DEBUG, 'error', 'Trying to send controller template before setting it.');
            }
        },

        sendToUser: function (name, message) {
            var msg = {};
            msg.data = message;
            msg.username = name;
            this.sendToServer('messageToClient', msg);
        },

        broadcastMessage: function (message) {
            this.sendToServer('messageToAllClients', message);
        },

        // request data for a game. if no game id is provided the data of all games are request
        getGameData: function(callback, gameId){
            this.sendToServer('requestGameData', {
                game: gameId ? gameId : null
            });
            // set return event to call callback method provided
            this.socket.on('responseGameData', callback);
        }

    };
    return gameApi;
});
