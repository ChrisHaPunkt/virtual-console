define(['jquery', '/socket.io/socket.io.js', 'qrcode.min'], function ($, io, qrcode) {

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
        overlayMenuIsActive: false,
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

            // container for all dom elements
            this.domElements = {};

            // get overlay menu div
            this.domElements.overlayMenu = $('#overlayMenu');
            if (!this.domElements.overlayMenu) {
                this.addLogMessage(this.log.DEBUG, 'ERROR', 'No overlayMenu DIV!');
            } else {
                this.domElements.overlayMenu.hide();
            }

            /**
             * Build up a connection to server
             *
             * This is done by a handshake
             *
             * Client -> Server : 'frontendInit'
             * Server -> Client : 'frontendInitAck'
             */

                // open socket connection to server - the origin ip of the http files is used if not specified
            this.socket = io.connect();

            // send init request when socket is connected
            this.socket.on('connect', function () {
                this.socket.emit('frontendInit', {});
            }.bind(this));

            // handshake with server was successful
            this.socket.on('frontendInitAck', function (incomingMessage) {
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
             * MISC
             * */
            this.initQrCode();

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
                    pageLogContent.innerHTML = '<p class="logMessage"><span class="logMessage_type">' + type + ': </span><span class="logMessage_content">' + msg + '</span></p>' + pageLogContent.innerHTML;
                }
                // if log level is INFO just log INFO logs
            } else if (this.logLevel === this.log.INFO && level === this.log.INFO) {
                console.log(type + ": " + msg);
                pageLogContent.innerHTML = '<p class="logMessage"><span class="logMessage_type">' + type + ': </span><span class="logMessage_content">' + msg + '</span></p>' + pageLogContent.innerHTML;
            }
        },

        initQrCode: function () {
            // qrcode library cannot use jquery dom element
            this.domElements.qrcode = document.getElementById("qrcode");
            console.log(this.domElements.qrcode);
            this.qrCode = new QRCode(this.domElements.qrcode, {
                text: "" + this.socket.io.uri,
                width: 128,
                height: 128
            });
            //click listener for hiding qrcode
            this.qrCode.qrcode_hidden = false;
            this.domElements.qrcode.addEventListener('click', function () {
                if (this.qrCode.qrcode_hidden) {
                    this.domElements.qrcode.style.opacity = 1;
                    this.qrCode.qrcode_hidden = false;
                } else {
                    this.domElements.qrcode.style.opacity = 0;
                    this.qrCode.qrcode_hidden = true;
                }
            }.bind(this));
        },

        /**
         * INCOMING COMMUNICATION
         * */
        onIncomingMessage: function (data) {
            if (this.overlayMenuIsActive) {
                if (data.type === 'button' && data.data.message.buttonName === 'overlayMenuButton') {
                    this.domElements.overlayMenu.hide();
                    this.overlayMenuIsActive = false;
                }
                // TODO add navigation via controller buttons
            } else {
                if (data.type === 'button' && data.data.message.buttonName === 'overlayMenuButton') {
                    this.domElements.overlayMenu.show();
                    this.overlayMenuIsActive = true;
                } else {
                    // pass data to function defined by game only if overlay Menu is NOT active
                    this.frontendInboundMessage(data);
                }
            }
        },

        /**
         * OUTGOING COMMUNICATION
         * */
        sendToServer_Message: function (messageType, message) {
            if (this.socket != null) {
                this.socket.emit('frontendOutboundMessage', {type: messageType, data: message});
            } else {
                this.addLogMessage(this.log.DEBUG, 'error', 'No server connection. Please initiate. \'init()\'');
            }
        },

        sendToServer_Data: function (requestType, data, callback) {
            if (this.socket != null) {
                // callback is send to server and called server-sided // direct response possible
                this.socket.emit('frontendOutboundData', {request: requestType, data: data}, callback);
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
                this.sendToServer_Data('setControllerTemplate', this.controller);
            } else {
                this.addLogMessage(this.log.DEBUG, 'error', 'Trying to send controller template before setting it.');
            }
        },

        sendToUser: function (name, message) {
            var msg = {};
            msg.data = message;
            msg.username = name;
            this.sendToServer_Message('messageToClient', msg);
        },

        broadcastMessage: function (message) {
            this.sendToServer_Message('messageToAllClients', message);
        },

        // request data for a game. if no game id is provided the data of all games are request
        getGameData: function (callback, gameId) {
            this.sendToServer_Data('requestGameData', {
                game: gameId ? gameId : null
            }, callback);
        }

    };
    return gameApi;
});
