/**
 * Created by dennis on 26.11.15.
 */
define("jquery", [], function () {
    return jQuery.noConflict();
});


require(['click', 'clientNetwork', 'sensor', 'jquery'], function (click, cn, sensor, $) {
    ////////////////////////////////////
    //Setting Visibility of Logint and Controller
    ////////////////////////////////////
    var loginDiv = $('#login-body');
    var contentDiv = $('#content-body');

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
    };

    hideContent();
    showLogin();


    ////////////////////////////////////
    //Open socket
    ////////////////////////////////////
    var serverURL = "127.0.0.1";
    var serverPort = 5222;

    var resHandler = {
        onMessage: function (type, msg) {
            // do anything you want with server messages
            console.log(type, msg);
        },
        onAnonymousLogin: function (data) {
            if (data.result) {
                hideLogin();
                showContent();
            } else {
                // false login
            }
            console.log(data);
        },
        onLogin: function (data) {
            if (data.result) {
                hideLogin();
                showContent();
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
    //Define onclick listener
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
                    buttonName: 'btn-left', buttonState: 7,
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
});