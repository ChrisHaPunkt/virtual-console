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
var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6}



function vibrate(milliseconds){
    window.navigator.vibrate(milliseconds);
}



function getMotionData(rnd){
    window.ondevicemotion = function(event) {
        var accelerationX = event.acceleration.x; //hoch, runter
        var accelerationY = event.acceleration.y; //hoch, runter
        var accelerationZ = event.acceleration.z; //vor, zurück

        var rotationAlpha    = event.rotationRate.alpha; //rotation um karthesische X-Achse (kippen vor, zurück)
        var rotationBeta   = event.rotationRate.beta; //rotation um karthesische Y-Achse (drehen)
        var rotationGamma   = event.rotationRate.gamma; //rotation um karthesische Z-Achse (kippen links, rechts)



        var interval = event.interval;




        if(typeof(rnd) != "undefined"){
            accelerationX = accelerationX.toFixed(rnd);
            accelerationY = accelerationY.toFixed(rnd);
            accelerationZ = accelerationZ.toFixed(rnd);
            rotationAlpha = rotationAlpha.toFixed(rnd);
            rotationBeta = rotationBeta.toFixed(rnd);
            rotationGamma =rotationGamma.toFixed(rnd);
        }

        $('#x').html('Beschleunigung in X-Richtung:' + accelerationX);
        $('#y').html('Beschleunigung in Y-Richtung:' + accelerationY);
        $('#z').html('Beschleunigung in Z-Richtung:' + accelerationZ);

        $('#a').html('Rotation in Alpha:' + rotationAlpha);
        $('#b').html('Rotation in Beta:' + rotationBeta);
        $('#c').html('Rotation in Gamma:' + rotationGamma);

        $('#i').html('Rotation in Gamma:' + interval);


        /*


        var motion = {
            accelerationX: accelerationX,
            rotationBeta: accelerationY,
            rotationGamma: accelerationZ,
            rotationAlpha: rotationAlpha,
            rotationBeta: rotationBeta,
            rotationGamma: rotationGamma,
            interval: interval
        };
        return motion;
        */
    }
}

getMotionData(2);









function getUserAudioVideo(){
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
            function(localMediaStream) {
                // Get a reference to the video element on the page.
                var vid = document.getElementById('camera-stream');
                // Create an object URL for the video stream and use this
                // to set the video source.
                vid.src = window.URL.createObjectURL(localMediaStream);
            },
            // Error Callback
            function(err) {
                // Log the error to the console.
                alert('The following error occurred when trying to use getUserMedia: ' + err);
            }
        );
    } else {
        alert('Sorry, your browser does not support getUserMedia');
    }
}














function getBatteryStatus() {
    navigator.getBattery().then(function (battery) {
        BatteryStatus
        {
            var batteryChargingState = battery.charging;
            var batteryLevel = battery.level;
            var batteryChargingTime = battery.chargingTime;
            var batteryDischargingTime = battery.dischargingTime;

            battery.addEventListener('chargingchange', function () {
                $('#batteryChargingState').html("Battery charging? " + (battery.charging ? "Yes" : "No"));
                batteryChargingState = battery.charging;
            });
            battery.addEventListener('levelchange', function () {
                $('#batteryLevel').html("Battery level: " + battery.level * 100 + "%");
                batteryLevel = battery.level;
            });
            battery.addEventListener('chargingtimechange', function () {
                $('#batteryChargingTime').html("Battery charging time: " + battery.chargingTime + " seconds");
                batteryChargingTime = battery.chargingTime;
            });
            battery.addEventListener('dischargingtimechange', function () {
                $('#batteryDischargingTime').html("Battery discharging time: " + battery.dischargingTime + " seconds");
                batteryDischargingTime = battery.dischargingTime;
            });
        }
    });
}


function getDeviceOrientation(){
    var deviceOrientation = window.orientation
    var isPortrait = deviceOrientation % 180 === 0;
    document.body.className = isPortrait ? 'portrait' : 'landscape';
}

