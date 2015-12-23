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

    var hideLogin = function(){
        //loginDiv.hide();
        loginDiv.slideUp();
    };
    var hideContent = function(){
        contentDiv.hide();
    };
    var showLogin = function(){
        loginDiv.show();
    };
    var showContent = function(){
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
            if(data.result){
                hideLogin();
                showContent();
            }else{
                // false login
            }
            console.log(data);
        },
        onLogin: function (data) {
            if(data.result){
                hideLogin();
                showContent();
            }else{
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
    var sendAnonymousLogin = function(){
        //event.preventDefault();
        socket.sendAnonymousLogin();
    };

    var sendRegister = function(){
        //event.preventDefault();
        socket.sendRegister(document.getElementById('input-user').value, document.getElementById('input-password').value);
    };
    var sendLogin = function(){
        //event.preventDefault();
        socket.sendLogin(document.getElementById('input-user').value, document.getElementById('input-password').value);
    };

    document.getElementById("anonymous").addEventListener("click", sendAnonymousLogin);
    document.getElementById("register").addEventListener("click", sendRegister);
    document.getElementById("login").addEventListener("click", sendLogin);



    ///////////////////////////////////////
    // passing socket instance to modules
    ///////////////////////////////////////
    click.setSocket(socket);
    sensor.setSocket(socket);
});