/**
 * Created by dennis on 26.11.15.
 */
define("jquery", [], function () {
    return jQuery.noConflict();
});


require(['click', 'clientNetwork', 'sensor', 'jquery'], function (click, cn, sensor, $) {

    window.addEventListener('load', function(e) {

    }, false);
    var loginDiv = $('#login-body');

    var contentDiv = $('#content-body');
    var overlayMenuButton = $('#btn-overlayMenu');


    ////////////////////////////////////
    //Setting Visibility of Login and Controller
    ////////////////////////////////////
    var hideLogin = function () {
        //loginDiv.hide();
        loginDiv.slideUp();
    };
    var hideContent = function () {
        contentDiv.hide();
    };
    var showLogin = function () {
        loginDiv.show();
    };
    var showContent = function () {
        contentDiv.show();
        setTimeout(function() {
            console.log("scroll");
            window.scrollTo(9999999, 1); }, 1);
        $("#landscape_hint").show()
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


    ////////////////////////////////////
    //Open socket
    ////////////////////////////////////
    var serverURL = "127.0.0.1";
    var serverPort = 80;

    var resHandler = {
        onMessage: function (type, msg) {
            // do anything you want with server messages
            console.log(type, msg);

            //vibrate
          //  sensor.vibrate(500);
        },
        onAnonymousLogin: function (data) {
            if (data.result) {
                hideLogin();
                showContent();
                showOverlayMenuButton();

            } else {
                // false login
            }
            console.log(data);
        },
        onLogin: function (data) {
            if (data.result) {
                hideLogin();
                showContent();
                showOverlayMenuButton();
            } else {
                // false login
            }
            console.log(data);
        },
        onRegister: function (data) {
            // do anything you want with server messages
            console.log(data);
        }
    };
    var socket = cn(serverURL, serverPort, resHandler);


    /////////////////////////////////////
    //Define Login onclick listener
    /////////////////////////////////////
    var sendAnonymousLogin = function () {
        //event.preventDefault();
        socket.sendAnonymousLogin();
    };

    var sendRegister = function () {
        //event.preventDefault();
        socket.sendRegister(document.getElementById('input-user').value, document.getElementById('input-password').value);
    };
    var sendLogin = function () {
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
            overlayMenuButton.css('top', ($('html').height() - overlayMenuButton.height()) / 2);
            overlayMenuButton.css('left', ($('html').width() - overlayMenuButton.width()) / 2);
        } else if (position === 'top') {
            overlayMenuButton.css('top', 0);
            overlayMenuButton.css('left', ($('html').width() - overlayMenuButton.width()) / 2);
        } else if (position === 'bottom') {
            overlayMenuButton.css('bottom', 0);
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