/**
 * Created by michaelschleiss on 05.11.15.
 */
/*
 ACCELERATION AND ROTATION

 */

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


/*
function getBatteryStatus(){
    navigator.getBattery().then(function(battery) {
        BatteryStatus{

            var batteryChargingState = battery.charging;
            var batteryLevel = battery.level;
            var batteryChargingTime = battery.chargingTime;
            var batteryDischargingTime = battery.dischargingTime;




        battery.addEventListener('chargingchange', function () {
            $('#batteryChargingState').html("Battery charging? " + (battery.charging ? "Yes" : "No"));
        });
        battery.addEventListener('levelchange', function () {
            $('#batteryLevel').html("Battery level: " + battery.level * 100 + "%");
        });
        battery.addEventListener('chargingtimechange', function () {
            $('#batteryChargingTime').html("Battery charging time: " + battery.chargingTime + " seconds");
        });
        battery.addEventListener('dischargingtimechange', function () {
            $('#batteryDischargingTime').html("Battery discharging time: " + battery.dischargingTime + " seconds");
        });
        }
    });



}*/