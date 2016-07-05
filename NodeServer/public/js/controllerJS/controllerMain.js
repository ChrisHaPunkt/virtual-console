/**
 * Created by dennis on 26.11.15.
 */
define("jquery", [], function () {
    return jQuery.noConflict();
});

var jQuery;
var testFunction;
require(['click', 'clientNetwork', 'sensor', 'jquery', '../libs/jquery.noty.packaged.min'], function (click, cn, sensor, $, noty) {

    var login = {
        anonym: null,
        username: null,
        state: false
    };
    jQuery = $;
    var loginDiv = $('#login-body');
    var contentDiv = $('#content-body');
    var overlayMenuButton = $('#btn-overlayMenu');
    var currentActiveController = $('#controller_7'); // hardcoded default 'EXTERN'
    currentActiveController.show();
    var controllerCSS = $('#controller_css');
    controllerCSS.attr("href", "/stylesheets/controller/controllerExternal.css");

    var hint = {
        success: function (msg) {

            var n = noty({
                type: 'success',
                text: msg,
                killer: true,
                layout: 'top',
                timeout: '5000'
            });
        },
        error: function (msg) {
            var n = noty({
                type: 'error',
                text: msg,
                killer: true,
                layout: 'top'
            });

        }


    };

    ////////////////////////////////////
    //Setting Visibility of Login and Controller
    ////////////////////////////////////
    var showLogin = function () {
        loginDiv.show();
    };
    var hideLogin = function () {
        //loginDiv.hide();
        loginDiv.slideUp();
    };
    var showContent = function () {
        contentDiv.show();
        setTimeout(function () {
            console.log("scroll");
            window.scrollTo(9999999, 1);
        }, 1);
        $("#landscape_hint").show()
    };
    var hideContent = function () {
        contentDiv.hide();
    };
    var switchVisibleController = function(id){
        var tmpObject = $('#controller_' + id);
        // check if controller DIV exists
        if (tmpObject.length > 0) {
            currentActiveController.hide();
            currentActiveController = tmpObject;
            currentActiveController.show();
            controllerCSS.attr("href", "/stylesheets/controller/" + currentActiveController.attr('controllerCSS') + ".css");
        }
    };
    var showOverlayMenuButton = function () {
        alignOverlayMenuButton();
        overlayMenuButton.show();
    };
    var hideOverlayMenuButton = function () {
        overlayMenuButton.hide();
        $("#landscape_hint").hide()
    };

    hideContent();
    hideOverlayMenuButton();
    showLogin();

    var showAddNewGameUrl = function () {
        var container = '<div class="addNewGameContainer"><h3>Add new Game:</h3>' +

            '   <span><label>Name:<div><input type="text" id="name" placeholder="Name"></div></label></span>' +
            '   <span><label>UniqueName:<div><input type="text" id="uname" placeholder="Unique_Name"></div></label></span>' +
            '   <span><label>URL:<div><input type="text" id="url" placeholder="http://..."></div></label></span>' +
            '</div>';
        var n = noty({
            type: 'confirm',
            modal: true,
            layout: 'topCenter',
            text: container,
            closeWith: ['button'],
            buttons: [
                {
                    addClass: 'btn btn-primary', text: 'Add', onClick: function ($noty) {
                    var name = $(".addNewGameContainer").find("#name").val();
                    var uname = $(".addNewGameContainer").find("#uname").val();
                    var url = $(".addNewGameContainer").find("#url").val();
                    // this = button element
                    // $noty = $noty element

                    $noty.close();
                    var transferObject = {
                        type: "ext",
                        name: name,
                        uname: uname,
                        url: url
                    };

                    socket.sendData("addNewGameDetails", transferObject);
                }
                },
                {
                    addClass: 'btn btn-danger', text: 'Cancel', onClick: function ($noty) {
                    $noty.close();
                    noty({text: 'You clicked "Cancel" button', type: 'warning'});
                }
                }
            ]
        });
    };

    var alterKeymappingsForUser = function (user) {

        var spin = noty({
            type: 'confirm',
            modal: true,
            layout: 'topCenter',
            text: "<span>Fetching maps <br><br> <i class='fa fa-fw fa-spin fa-spinner'></i></span>"
        });

        /**
         * TODO Fetch user mappings from server
         */
        socket.sendData("getUserKeymapping", {username: user}, function(response){
            spin.close();
            console.log(response);
            var map = response;
            var container =
                '<div class="alterKeymappingContainer"><h3>Altering keymapping for ' + user + ':</h3>' +
                '   ' +
                '   <textarea style="width: 100%;max-width: 100%;min-height: 100%;overflow: auto" id="mapContent">' + JSON.stringify(map, undefined, 4) + '</textarea>' +
                '</div>';
            var n = noty({
                type: 'confirm',
                modal: true,
                layout: 'topCenter',
                text: container,
                closeWith: ['button'],
                buttons: [
                    {
                        addClass: 'btn btn-primary',
                        text: 'Save',
                        onClick: function ($noty) {
                            var mapContent = $(".alterKeymappingContainer").find("#mapContent").val();
                            // this = button element
                            // $noty = $noty element

                            $noty.close();
                            var transferObject = {
                                username: user,
                                newMap: JSON.parse(mapContent)
                            };
                            console.log(transferObject);
                            socket.sendData("alterKeymappingForUser", transferObject);
                        }
                    },
                    {
                        addClass: 'btn btn-danger', text: 'Cancel', onClick: function ($noty) {
                        $noty.close();
                        noty({text: 'You clicked "Cancel" button', type: 'warning'});
                    }
                    }
                ]
            });

            var text = document.getElementById('mapContent');

            function resize() {
                text.style.height = 'auto';
                text.style.height = jQuery(window).height() * 50 / 100 + 'px';
            }

            resize();
        });



    };

    $(".title").click(function () {
        if (login.state === true && !login.anonym) {
            alterKeymappingsForUser(login.username);
        }

    });

    ////////////////////////////////////
    //Open socket
    ////////////////////////////////////
    var serverURL = "127.0.0.1";
    var serverPort = 80;

    var resHandler = {
        onMessage: function (type, msg) {
            // do anything you want with server messages
            console.log('Message from Server ', type, msg);
            switch (type) {
                case 'command-openGameUrlInput':
                    showAddNewGameUrl();
                    break;
                case 'loadControllerTemplate':
                    switchVisibleController(msg);
                    break;
                case 'command-userKeymapping':
                    alterKeymappingsForUser(msg.user, msg.map);
                    break;
                default:
                    console.log('unknown command from server: ', type, msg);
            }
        },
        onAnonymousLogin: function (data) {
            if (data.result) {

                login.state = true;
                login.anonym = true;
                login.username = data.username;

                hint.success('<b>Welcome: ' + data.username + '</b> ');
                hideLogin();
                showContent();
                showOverlayMenuButton();

            } else {
                // false login

                login.state = false;
                login.anonym = null;
                login.username = null;
            }
            console.log(data);
        },
        onLogin: function (data) {
            if (data.result) {

                login.state = true;
                login.anonym = false;
                login.username = data.username;

                hint.success('<b>Welcome: ' + data.username + '</b> ')
                hideLogin();
                showContent();
                showOverlayMenuButton();
            } else {
                // false login

                login.state = false;
                login.anonym = null;
                login.username = null;
                hint.error(data.message);

            }
            console.log(data);
        },
        onRegister: function (data) {
            // do anything you want with server messages
            console.log(data);
            if (data.result) {
                hint.success('<b>Erfolg: </b> User added.. Login');
                sendLogin();
            } else {
                hint.error('<b>Error: </b>' + data.message)
            }
        }
    };
    var socket = cn(serverURL, serverPort, resHandler);


    /////////////////////////////////////
    //Define Login onclick listener
    /////////////////////////////////////
    var sendAnonymousLogin = function () {
        //event.preventDefault();
        $.noty.closeAll();
        socket.sendAnonymousLogin();
    };

    var sendRegister = function () {
        //event.preventDefault();
        $.noty.closeAll();
        socket.sendRegister(document.getElementById('input-user').value, document.getElementById('input-password').value);
    };
    var sendLogin = function () {
        $.noty.closeAll();
        //event.preventDefault();
        socket.sendLogin(document.getElementById('input-user').value, document.getElementById('input-password').value);
    };

    document.getElementById("anonymous").addEventListener("click", sendAnonymousLogin);
    document.getElementById("register").addEventListener("click", sendRegister);
    document.getElementById("login").addEventListener("click", sendLogin);

    /////////////////////////////////////
    //Overlay Menu Button
    /////////////////////////////////////
    var alignOverlayMenuButton = function (position) {
        if (!position) {
            //overlayMenuButton.css('top', ($('html').height() - overlayMenuButton.height()) / 2);
            overlayMenuButton.css('left', ($('html').width() - overlayMenuButton.width()) / 2);
        } else if (position === 'top') {
          //  overlayMenuButton.css('top', 0);
            overlayMenuButton.css('left', ($('html').width() - overlayMenuButton.width()) / 2);
        } else if (position === 'bottom') {
           // overlayMenuButton.css('bottom', 0);
            overlayMenuButton.css('left', ($('html').width() - overlayMenuButton.width()) / 2);
        }
    };

    // set click listener
    overlayMenuButton.click(function () {
        socket.sendData('button', {
            buttonName: $(this).attr('id'),
            buttonState: 7, // 7 = button 'up'
            timestamp: Date.now()
        });
    });


    /////////////////////////////////////
    //Multi Client Simulation
    /////////////////////////////////////
    $("#simulateBtn").click(function () {
        var pid = simulateFunction();
        console.log("add " + pid);
    });
    window.simulateArray = [];
    var simulateCount = 0;
    var simulateFunction = function () {

        var i = 0;
        var pid = window.setInterval(function () {

            if (i % 2 == 0) {
                i++;

                var OrientationData = {
                    orientationBeta: Math.random() * (100 - (-100)) + (-100),
                    orientationGamma: Math.random() * (100 - (-100)) + (-100),
                    orientationAlpha: Math.random() * (100 - (-100)) + (-100),
                    timestamp: Date.now()
                };

                socket.sendData("orientationData", OrientationData);

            } else {

                i = 0;
                socket.sendData('button', {
                    buttonName: 'btn-left', buttonState: 8,
                    timestamp: Date.now()
                });
            }

        }, 1000);


        simulateCount++;
        $("#simulateBtn").html("Simulate " + simulateCount);
        window.simulateArray.push(pid);
        return pid;
    };


    ///////////////////////////////////////
    // passing socket instance to modules
    ///////////////////////////////////////
    click.setSocket(socket);
    sensor.setSocket(socket);
    $("#anonymous").focus();


});