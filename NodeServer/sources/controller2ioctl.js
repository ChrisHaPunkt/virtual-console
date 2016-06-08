/**
 * Created by michaelschleiss on 10.05.16.
 */
var uinput = require('uinput');

var setup_options = {
    EV_KEY : [  uinput.KEY_RIGHT,
                uinput.KEY_LEFT,
                uinput.KEY_UP,
                uinput.KEY_DOWN,
                uinput.KEY_SPACE,
                uinput.KEY_ENTER,
                uinput.KEY_E,
                uinput.KEY_L,
                uinput.KEY_O ]
}

exports.getKeyMapping = function(gameID, playerID) {

    return {
        "btn-up": "UP",
        "btn-left": "LEFT",
        "btn-right": "RIGHT",
        "btn-down": "DOWN",
        "btn-center": "",
        "btn-select": "",
        "btn-start": "",
        "btn-<": "",
        "btn-x": "",
        "btn-b": "",
        "btn-a": ""
    };
};

exports.hellotest = function(buttonName) {
    uinput.setup(setup_options, function (err, stream) {
        if (err) {
            throw(err);
        }

        var create_options = {
            name: 'myuinput',
            id: {
                bustype: uinput.BUS_VIRTUAL,
                vendor: 0x1,
                product: 0x1,
                version: 1
            }
        };

        uinput.create(stream, create_options, function (err) {
            if (err) {
                throw(err);
            }

            setTimeout(function () {
                uinput.key_event(stream, uinput["KEY_" + buttonName], function (err) {
                    if (err) {
                        throw(err);
                    }
                });
            }, 1000);
        });
    });
};

var meinStream;

uinput.setup(setup_options, function (err, stream) {
    if (err) {
        throw(err);
    }
    meinStream = stream;

    var create_options = {
        name: 'myuinput',
        id: {
            bustype: uinput.BUS_VIRTUAL,
            vendor: 0x1,
            product: 0x1,
            version: 1
        }
    };

    uinput.create(stream, create_options, function (err) {
        if (err) {
            throw(err);
        }

    });

    exports.send_key_event = function(buttonName, buttonState) {

        setTimeout(function () {
            uinput.send_event(meinStream, uinput.EV_KEY, uinput["KEY_" + buttonName], buttonState, function(err) {
                if (err) {
                    throw(err);
                }
            });
        }, 1);
    };
});
