/**
 * Created by michaelschleiss on 05.11.15.
 */
/*
 ACCELERATION AND ROTATION

 */
define(['jquery'], function ($) {

    var socket = null; // local socket reference to call send methods

    function startMotionCapture(minMotion, minRotation) {
        window.addEventListener('devicemotion', function (event) {
            //window.ondevicemotion = function  (event) {
            var accelerationX = event.acceleration.x; //hoch, runter
            var accelerationY = event.acceleration.y; //hoch, runter
            var accelerationZ = event.acceleration.z; //vor, zurück

            if (accelerationX == null) {
                accelerationX = 0;
            }
            if (accelerationY == null) {
                accelerationY = 0;
            }
            if (accelerationZ == null) {
                accelerationZ = 0;
            }


            var rotationAlpha = event.rotationRate.alpha; //rotation um karthesische X-Achse (kippen vor, zurück)
            var rotationBeta = event.rotationRate.beta; //rotation um karthesische Y-Achse (drehen)
            var rotationGamma = event.rotationRate.gamma; //rotation um karthesische Z-Achse (kippen links, rechts)

            if (rotationAlpha == null) {
                rotationAlpha = 0;
            }
            if (rotationBeta == null) {
                rotationBeta = 0;
            }
            if (rotationGamma == null) {
                rotationGamma = 0;
            }

            var interval = event.interval;

            var MotionData = {

                accelerationX: accelerationX,
                accelerationY: accelerationY,
                accelerationZ: accelerationZ,
                rotationAlpha: rotationAlpha,
                rotationBeta: rotationBeta,
                rotationGamma: rotationGamma,
                timestamp: Date.now()
            };
            /*
             if (MotionData.accelerationX > minMotion || MotionData.accelerationY > minMotion || MotionData.accelerationZ > minMotion ||
             MotionData.rotationAlpha > minRotation || MotionData.rotationBeta > minRotation || MotionData.rotationGamma > minRotation) {
             var checkAcc = $('#chkAcc').prop('checked');
             if (checkAcc==true) {
             socket.sendData("motionData", MotionData);
             }
             }


             */
            var AccelerationData = {
                accelerationX: accelerationX,
                accelerationY: accelerationY,
                accelerationZ: accelerationZ,
                timestamp: Date.now()
            };
            var RotationData = {
                rotationAlpha: rotationAlpha,
                rotationBeta: rotationBeta,
                rotationGamma: rotationGamma,
                timestamp: Date.now()
            };


            if (MotionData.accelerationX > minMotion || MotionData.accelerationY > minMotion || MotionData.accelerationZ > minMotion ||
                MotionData.accelerationX < -minMotion || MotionData.accelerationY < -minMotion || MotionData.accelerationZ < -minMotion) {
                var checkAcc = $('#chkAcc').prop('checked');
                if (checkAcc == true) {
                    socket.sendData("accelerationData", AccelerationData);
                }
            }
            if (MotionData.rotationAlpha > minRotation || MotionData.rotationBeta > minRotation || MotionData.rotationGamma > minRotation ||
                MotionData.rotationAlpha < -minRotation || MotionData.rotationBeta < -minRotation || MotionData.rotationGamma < -minRotation
            ) {
                var checkRot = $('#chkRot').prop('checked');
                if (checkRot == true) {
                    socket.sendData("rotationData", RotationData);
                }
            }


        });
        window.addEventListener('deviceorientation', handleOrientation);

        function handleOrientation(event) {
            var orientationBeta = event.beta;  // In degree in the range [-180,180]
            var orientationGamma = event.gamma; // In degree in the range [-90,90]
            var orientationAlpha = event.alpha; // In degree in the range [-90,90]

            var OrientationData = {
                orientationBeta: orientationBeta,
                orientationGamma: orientationGamma,
                orientationAlpha: orientationAlpha
            };
            //TODO: Orientationdata != Accelrometer ??
            if ($('#chkRot').prop('checked'))
                socket.sendData("orientationData", OrientationData);

        }
    }


    startMotionCapture(0.3, 0);

    function vibrate(milliseconds) {
        window.navigator.vibrate(milliseconds);
    }

    /*
     VIDEO AND AUDIO CAPTURING WITH getUserMedia()
     */
    const START = true;
    const STOP = false;

    $('#chkVid').change(function () {
        var checkVideo = $('#chkVid').prop('checked');
        if (checkVideo == true) {
            getUserAudioVideo(START);
            $('#lblCheckboxVid').css("color", "red");
        }
        if (checkVideo == false) {
            getUserAudioVideo(STOP)
            $('#lblCheckboxVid').css("color", "white");
        }
    });

    function getUserAudioVideo(status) {
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
                    if (status == false) {
                        vid.pause();
                    }
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
        var deviceOrientation = window.orientation;
        var isPortrait = deviceOrientation % 180 === 0;
        document.body.className = isPortrait ? 'portrait' : 'landscape';
        return document.body.className;
    }

    // return object with public functions of the require module
    return {
        setSocket: function (_socket) {
            socket = _socket;
        },
        // add more if needed
        vibrate: vibrate
    }
});