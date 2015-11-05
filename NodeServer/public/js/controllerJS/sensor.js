/**
 * Created by michaelschleiss on 05.11.15.
 */
/*
 ACCELERATION AND ROTATION

 */

function getMotionData(rnd){
    window.ondevicemotion = function(event) {
        var accelerationX = event.acceleration.x; //links,rechts
        var accelerationY = event.acceleration.y; //hoch, runter
        var accelerationZ = event.acceleration.z; //vor, zurück

        var rotationAlpha    = event.rotationRate.alpha; //rotation um karthesische X-Achse (kippen vor, zurück)
        var rotationBeta   = event.rotationRate.beta; //rotation um karthesische Y-Achse (drehen)
        var rotationGamma   = event.rotationRate.gamma; //rotation um karthesische Z-Achse (kippen links, rechts)

        var interval = event.interval;

        if( rnd != []){
            accelerationX = accelerationX.toFixed(rnd);
            accelerationY = accelerationY.toFixed(rnd);
            accelerationZ = accelerationZ.toFixed(rnd);
            rotationAlpha = rotationAlpha.toFixed(rnd);
            rotationBeta = rotationBeta.toFixed(rnd);
            rotationGamma =rotationGamma.toFixed(rnd);
        }



        alert(accelerationX);

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
    }
}
