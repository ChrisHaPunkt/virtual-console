define(['/socket.io/socket.io.js'], function (io) {

    gameApi = {

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
        pageLogContent: null,
        frontendConnectionOutbound: null,
        frontendConnection: null,
        frontendInboundMessage: null,
        controller: null,
        init: function () {

            /**
             * Build up a connection to server
             */
            this.socket = io.connect();

            if (this.logLevel === null)
                this.logLevel = this.log.DEBUG;

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

            if (this.logLevel == this.log.DEBUG)
                this.addLogMessage("init", "Game Api successfully Initialized");

            return this;
        },

        // write to logcontent
        addLogMessage: function (type, msg) {
            var pageLogContent = document.getElementById(this.logContainer);
            if (this.logLevel === this.log.DEBUG) {
                if (typeof msg === 'string') {
                    pageLogContent.innerHTML = '<p class="message"><span class="messageType">' + type + ': </span><span class="messageContent">' + msg + '</span></p>' + pageLogContent.innerHTML;
                }
            }
        }

    };
    return gameApi;
});
//TODO: Require as module
