/**
 * Created by michaelschleiss on 05.11.15.
 */
/*
 ACCELERATION AND ROTATION

 */

/*
 function getBrowserByFeature(){
 var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
 // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
 var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
 var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
 // At least Safari 3+: "[object HTMLElementConstructor]"
 var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
 var isIE = /*@cc_on!@*/
false || !!document.documentMode; // At least IE6}


/*window.ondevicemotion = function  (event) {
    var accelerationX = event.acceleration.x; //hoch, runter
    var accelerationY = event.acceleration.y; //hoch, runter
    var accelerationZ = event.acceleration.z; //vor, zurück

    var rotationAlpha = event.rotationRate.alpha; //rotation um karthesische X-Achse (kippen vor, zurück)
    var rotationBeta = event.rotationRate.beta; //rotation um karthesische Y-Achse (drehen)
    var rotationGamma = event.rotationRate.gamma; //rotation um karthesische Z-Achse (kippen links, rechts)

    var interval = event.interval;

    var MotionData ={
        accelerationX:accelerationX,
        accelerationY:accelerationY,
        accelerationZ:accelerationZ,
        rotationAlpha:rotationAlpha,
        rotationBeta:rotationBeta,
        rotationGamma:rotationGamma
    };
    socket.sendData(MotionData);
}
*/
/*
function startMotionCapture(){
    window.addEventListener('devicemotion', function onDeviceMoved(event){
    //window.ondevicemotion = function  (event) {
        var accelerationX = event.acceleration.x; //hoch, runter
        var accelerationY = event.acceleration.y; //hoch, runter
        var accelerationZ = event.acceleration.z; //vor, zurück

        var rotationAlpha = event.rotationRate.alpha; //rotation um karthesische X-Achse (kippen vor, zurück)
        var rotationBeta = event.rotationRate.beta; //rotation um karthesische Y-Achse (drehen)
        var rotationGamma = event.rotationRate.gamma; //rotation um karthesische Z-Achse (kippen links, rechts)

        var interval = event.interval;

        var MotionData ={
            accelerationX:accelerationX,
            accelerationY:accelerationY,
            accelerationZ:accelerationZ,
            rotationAlpha:rotationAlpha,
            rotationBeta:rotationBeta,
            rotationGamma:rotationGamma
        };
        socket.sendData(MotionData.accelerationX);
    });
}
startMotionCapture();
*/





function startMotionCapture(){
    window.addEventListener('devicemotion', function  (event){
        //window.ondevicemotion = function  (event) {
        var accelerationX = event.acceleration.x; //hoch, runter
        var accelerationY = event.acceleration.y; //hoch, runter
        var accelerationZ = event.acceleration.z; //vor, zurück

        var rotationAlpha = event.rotationRate.alpha; //rotation um karthesische X-Achse (kippen vor, zurück)
        var rotationBeta = event.rotationRate.beta; //rotation um karthesische Y-Achse (drehen)
        var rotationGamma = event.rotationRate.gamma; //rotation um karthesische Z-Achse (kippen links, rechts)

        var interval = event.interval;

        var MotionData ={
            accelerationX:accelerationX,
            accelerationY:accelerationY,
            accelerationZ:accelerationZ,
            rotationAlpha:rotationAlpha,
            rotationBeta:rotationBeta,
            rotationGamma:rotationGamma
        };
        socket.sendData(MotionData);
    });
}
startMotionCapture();

function vibrate(milliseconds) {
    window.navigator.vibrate(milliseconds);
}

function getUserAudioVideo() {
    /*
     VIDEO AND AUDIO CAPTURING WITH getUserMedia()
     */
    navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

    // Check that the browser supports getUserMedia.
    // If it doesn't show an alert, otherwise continue.
    if (navigator.getUserMedia) {
        // Request the camera.
        navigator.getUserMedia(
            // Constraints
            {
                audio: true,
                video: true
            },
            // Success Callback
            function (localMediaStream) {
                // Get a reference to the video element on the page.
                var vid = document.getElementById('camera-stream');
                // Create an object URL for the video stream and use this
                // to set the video source.
                vid.src = window.URL.createObjectURL(localMediaStream);
            },
            // Error Callback
            function (err) {
                // Log the error to the console.
                alert('The following error occurred when trying to use getUserMedia: ' + err);
            }
        );
    } else {
        alert('Sorry, your browser does not support getUserMedia');
    }
}

navigator.getBattery().then(function (battery) {
    var batteryChargingState = battery.charging;
    var batteryLevel = battery.level;
    var batteryChargingTime = battery.chargingTime;
    var batteryDischargingTime = battery.dischargingTime;

     battery.addEventListener('chargingchange', function () {
     batteryChargingState = battery.charging;
     });
     battery.addEventListener('levelchange', function () {
     batteryLevel = battery.level;
     });
     battery.addEventListener('chargingtimechange', function () {
     batteryChargingTime = battery.chargingTime;
     });
     battery.addEventListener('dischargingtimechange', function () {
     batteryDischargingTime = battery.dischargingTime;
     });
});


function getDeviceOrientation() {
    var deviceOrientation = window.orientation
    var isPortrait = deviceOrientation % 180 === 0;
    document.body.className = isPortrait ? 'portrait' : 'landscape';
    return document.body.className;
}