/**
 * Created by michaelschleiss on 10.05.16.
 */
var uinput = require('uinput');
var Database = require('./Database');
var setup_options = {
    EV_KEY: [uinput.KEY_RIGHT,
        uinput.KEY_LEFT,
        uinput.KEY_UP,
        uinput.KEY_DOWN,
        uinput.KEY_SPACE,
        uinput.KEY_ENTER,
        uinput.KEY_Y,
        uinput.KEY_X,
        uinput.KEY_A,
        uinput.KEY_B,
        uinput.KEY_O]
}
var Keymapping = {

    getDefaultKeyMapping: function (gameID, playerID) {

        return {
            "btn-up": "UP",
            "btn-left": "LEFT",
            "btn-right": "RIGHT",
            "btn-down": "DOWN",
            "btn-center": "",
            "btn-select": "ENTER",
            "btn-start": "ENTER",
            "btn-y": "Y",
            "btn-x": "X",
            "btn-b": "B",
            "btn-a": "A"
        };
    },
    getKeyMappingByUserGame: function (gameID, playerID) {


        return {
            "btn-up": "UP",
            "btn-left": "LEFT",
            "btn-right": "RIGHT",
            "btn-down": "DOWN",
            "btn-center": "",
            "btn-select": "ENTER",
            "btn-start": "ENTER",
            "btn-y": "Y",
            "btn-x": "X",
            "btn-b": "B",
            "btn-a": "A"
        };
    },

    hellotest: function (buttonName) {
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
    }
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

    Keymapping.send_key_event = function (buttonName, buttonState) {

        setTimeout(function () {
            uinput.send_event(meinStream, uinput.EV_KEY, uinput["KEY_" + buttonName], buttonState - 7, function (err) {
                if (err) {
                    throw(err);
                }
            });
        }, 1);
    };
});

module.exports = Keymapping;