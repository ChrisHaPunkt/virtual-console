// http://requirejs.org/docs/api.html#config-shim
requirejs.config({
    paths: {
        "three": "/js/libs/three",
        "Chart": "/js/libs/Chart.min",
        "qrcode.min": '/js/libs/qrcode.min',
        "gameApi": '/js/gameApi'
    },
    shim: {
        three: {
            exports: 'THREE'
        }
    }
});
define(['jquery', '/socket.io/socket.io.js', 'qrcode.min', "Chart"], function ($, io, qrcode, Chart) {

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
            NEW: 5,
            MODERN: 6,
            EXTERN: 7
        },
        BUTTON: {
            UP: 7,
            DOWN: 8,
            HOLD: 9
        },
        headerMenu: {},
        overlayMenu: {isActive: false},
        logLevel: null,
        socket: null,
        performanceMonitor: {isActive: false},
        pageLogContent: null,
        frontendConnectionOutbound: null,
        frontendConnection: null,
        frontendInboundMessage: null,
        frontendInboundData: null,
        controller: null,
        chart: {},
        init: function () {

            // set log level to info if not set by game
            if (this.logLevel === null)
                this.logLevel = this.log.INFO;

            // set controller template to demo if not set by game
            if (this.controller === null)
                this.controller = this.controllerTemplates.DEMO;

            // get header menu div
            this.headerMenu.domElement = $('#menu');

            // get chart dom element
            this.performanceMonitor.domElement = $('#chart');

            // get overlay menu div
            this.overlayMenu.domElement = $('#overlayMenu');
            if (!this.overlayMenu.domElement) {
                this.addLogMessage(this.log.DEBUG, 'ERROR', 'No overlayMenu DIV!');
            } else {
                this.overlayMenu.domElement.hide();
            }

            // get overlay user name container
            this.overlayMenu.domElementActiveUser = $('#overLayActiveUser');

            // init overlaymenu handler
            this._initOverlayMenuHandler();

            // init performance chart
            this._initPerformanceChart();

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
            if (this.frontendInboundData !== null)
                this.socket.on('frontendInboundData', this.onIncomingData.bind(this));
            else return -1;

            /**
             * MISC
             * */
            this._initQrCode();

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

        _initQrCode: function () {
            // qrcode library cannot use jquery dom element
            this.qrCode = new QRCode(document.getElementById("qrcode"), {
                text: "" + this.socket.io.uri,
                width: 128,
                height: 128
            });
            this.qrCode.domElement = document.getElementById("qrcode");
            //click listener for hiding qrcode
            this.qrCode.qrcode_hidden = false;
            this.qrCode.domElement.addEventListener('click', function () {
                if (this.qrCode.qrcode_hidden) {
                    this.qrCode.domElement.style.opacity = 1;
                    this.qrCode.qrcode_hidden = false;
                } else {
                    this.qrCode.domElement.style.opacity = 0;
                    this.qrCode.qrcode_hidden = true;
                }
            }.bind(this));
        },

        _initPerformanceChart: function () {
            if (this.logLevel === this.log.DEBUG || this.logLevel === this.log.INFO) {

                this.addCustomOverlayMenuItem('Performance Monitor', function () {
                    if (!this.performanceMonitor.isActive) {
                        this.performanceMonitor.domElement.show();
                        this.performanceMonitor.isActive = true;
                        var data = {
                            labels: [0],
                            datasets: [{
                                fillColor: "rgba(220,220,220,0.2)",
                                strokeColor: "rgba(220,220,220,1)",
                                pointColor: "rgba(220,220,220,1)",
                                pointStrokeColor: "#fff",
                                pointHighlightFill: "#fff",
                                pointHighlightStroke: "#fff",
                                data: [0]
                            }]
                        };
                        this.performanceMonitor.data = data;
                        // setup chart
                        //Chart.defaults.global.defaultFontColor = "#fff";
                        //render Chart
                        // Get context with jQuery - using jQuery's .get() method.
                        var ctx = $("#myChart").get(0).getContext("2d");
                        // This will get the first returned node in the jQuery collection.
                        this.performanceMonitor.chartObj = new Chart(ctx).Line(data, {
                            maintainAspectRatio: false,
                            responsive: true
                        });
                        this.addLogMessage(this.log.INFO, 'info', 'Performance monitor started.');
                    } else {
                        this.performanceMonitor.domElement.hide();
                        this.performanceMonitor.isActive = false;
                        this.addLogMessage(this.log.INFO, 'info', 'Performance monitor stopped.');
                    }
                }, this);
            }
        },

        /**
         * OVERLAY-MENU HANDLERS
         * */
        _initOverlayMenuHandler: function () {
            this.overlayMenu.eventHandler = {
                'overLayButton_Main_Menu': function () {
                    window.location = '/menu';
                }.bind(this),
                'overLayButton_Settings': function () {
                    // TODO check if needed here
                }.bind(this),
                'overLayButton_Restart': function () {
                    // TODO trigger shutdown via socket
                    this.sendToServer_Data('restartServer', {
                        delay: 10
                    }, function (msg) {
                        console.error(msg);
                    });
                }.bind(this),
                'overLayButton_Shutdown': function () {
                    this.sendToServer_Data('shutdownServer', {
                        delay: 1000
                    }, function (msg) {
                        console.error(msg);
                    });
                }.bind(this)
            };

            // bind click handler to overlay menu buttons via class
            var that = this;
            // add event also to dynamic created elements // http://stackoverflow.com/a/18144022
            $('#overLayActiveButtons').on('click', '.overlayMenuItem', function () {
                // call button id specific event handler
                that.overlayMenu.eventHandler[this.id]();

                // close overlay menu after button click
                that.overlayMenu.domElement.css('display', 'none');
                that.overlayMenu.isActive = false;
            });
        },
        moveActiveMenuItem: function (direction) {
            this.overlayMenu.activeEntry = $('.activeMenuItem');
            var entryIndex = parseInt(this.overlayMenu.activeEntry.attr("menuindex"));
            var numberOfEntries = $('.overlayMenuItem').length;

            if (direction === 'left') {
                if (!(entryIndex <= 0)) {
                    var leftNeighbour = $('div[menuindex=' + parseInt(entryIndex - 1) + ']');
                    leftNeighbour.addClass('activeMenuItem');
                    this.overlayMenu.activeEntry.removeClass('activeMenuItem');
                }
            } else if (direction === 'right') {
                if (!(entryIndex >= numberOfEntries - 1)) {
                    var rightNeighbour = $('div[menuindex=' + parseInt(entryIndex + 1) + ']');
                    rightNeighbour.addClass('activeMenuItem');
                    this.overlayMenu.activeEntry.removeClass('activeMenuItem');
                }
            } else if (direction === 'up') {
                // TODO implement
                this.moveActiveMenuItem('left');
            } else if (direction === 'down') {
                // TODO implement
                this.moveActiveMenuItem('right');
            }
        },
        triggerActiveMenuItem: function () {
            $('.activeMenuItem').trigger("click");
        },
        addCustomOverlayMenuItem: function (name, action, context) {
            this.overlayMenu.nextElementIndex = this.overlayMenu.nextElementIndex || $('.overlayMenuItem').length;
            $('<div/>', {
                id: 'overLayButton_' + name.replace(' ', '_'),
                class: 'overlayMenuItem',
                menuindex: this.overlayMenu.nextElementIndex++
            }).html(name).appendTo($('#overLayActiveButtons'));
            this.overlayMenu.eventHandler['overLayButton_' + name.replace(' ', '_')] = action.bind(context);
        },
        removeOverlayMenuItem: function (name) {
            // TODO This method produces index errors, DONT use!!
            console.error("This method produces index errors, DONT use!!");
            $('#overLayButton_' + name.replace(' ', '_')).remove();
            delete this.overlayMenu.eventHandler['overLayButton_' + name.replace(' ', '_')];
        },


        /**
         * INCOMING COMMUNICATION
         * */
        onIncomingMessage: function (data) {
            if (this.overlayMenu.isActive) {
                if (data.type === 'button') {
                    switch (data.data.message.buttonName) {
                        case 'btn-overlayMenu':
                            this.overlayMenu.domElement.css('display', 'none');
                            this.overlayMenu.isActive = false;
                            break;
                        case 'btn-left':
                            this.moveActiveMenuItem('left');
                            break;
                        case 'btn-right':
                            this.moveActiveMenuItem('right');
                            break;
                        case 'btn-up':
                            this.moveActiveMenuItem('up');
                            break;
                        case 'btn-down':
                            this.moveActiveMenuItem('down');
                            break;
                        case 'btn-enter':
                            this.triggerActiveMenuItem();
                            break;
                    }
                }
            } else {
                if (data.type === 'button' && data.data.message.buttonName === 'btn-overlayMenu') {
                    console.log(data);
                    this.overlayMenu.domElement.css('display', 'flex');
                    this.overlayMenu.isActive = true;
                    this.overlayMenu.activeUser = data.data.clientName;
                    this.overlayMenu.domElementActiveUser.html(data.data.clientName);
                } else {
                    // pass data to function defined by game only if overlay Menu is NOT active
                    this.frontendInboundMessage(data);

                    // performance monitor
                    if (this.performanceMonitor.isActive) {
                        var controllerEvent = data.data.message;

                        if (this.performanceMonitor.isActive && (data.type == "button" || data.type == "accelerationData" || data.type == "orientationData")) {
                            var timestamp = Date.now();
                            var chart = this.performanceMonitor.chartObj;
                            console.log("Delay: " + (timestamp - controllerEvent.timestamp) + " ms");
                            if (chart.datasets[0].points.length > 30) {
                                //cleanup first points for a sliding view
                                chart.removeData();
                            }
                            chart.addData([(timestamp - controllerEvent.timestamp)], (timestamp - controllerEvent.timestamp) + " ms");
                        }
                    }
                }
            }
        },
        onIncomingData: function (data) {
            this.frontendInboundData(data);
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
