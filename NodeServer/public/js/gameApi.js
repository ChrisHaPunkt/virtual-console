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

            /**
             * Build up a connection to server
             */
            this.socket = io.connect();

            if (this.logLevel === null)
                this.logLevel = this.log.INFO;

            /**
             * Emit data back to server (eg. Controller Template)
             */
            var that = this;

            var backboundObj = {
                msg: "hi",
                controllerTemplate: this.controller === null ? this.controllerTemplates.DEMO : this.controller
            };
            this.socket.on('connect', function () {
                that.socket.emit('frontendInit', backboundObj);
            });

            /**
             * Local (Game-)Initialisation
             */
            if (this.frontendConnection !== null)
                this.socket.on('frontendConnection', this.frontendConnection);
            else
                return -1;

            /**
             * Handle incoming messages
             */
            if (this.frontendInboundMessage !== null)
                this.socket.on('frontendInboundMessage', this.frontendInboundMessage);
            else return -1;

            if (this.logLevel == this.log.INFO)
                this.addLogMessage(this.log.INFO, "init", "Game Api successfully Initialized");

            return this.socket;
        },

        // write to logcontent
        addLogMessage: function (level, type, msg) {
            var pageLogContent = document.getElementById(this.logContainer);
            // if log level is DEBUG log everything
            if(this.logLevel === this.log.DEBUG){
                console.log(type + ": " + msg);
                // additional log INFO levels to UI
                if(level === this.log.INFO){
                    pageLogContent.innerHTML = '<p class="message"><span class="messageType">' + type + ': </span><span class="messageContent">' + msg + '</span></p>' + pageLogContent.innerHTML;
                }
            // if log level is INFO just log INFO logs
            }else if(this.logLevel === this.log.INFO && level === this.log.INFO){
                console.log(type + ": " + msg);
                pageLogContent.innerHTML = '<p class="message"><span class="messageType">' + type + ': </span><span class="messageContent">' + msg + '</span></p>' + pageLogContent.innerHTML;
            }
        },

        sendToServer : function(messageType, message){
            if(this.socket != null){
                this.socket.emit('frontendOutboundMessage', {type:messageType, data:message});
            }
        },

        sendToUser : function(name, message){
            var msg = {};
            msg.data = message;
            msg.username = name;
            this.sendToServer('messageToClient', msg);
        },

        broadcastMessage : function(message){
            this.sendToServer('messageToAllClients',message);
        }

    };
    return gameApi;
});
//TODO: Require as module
