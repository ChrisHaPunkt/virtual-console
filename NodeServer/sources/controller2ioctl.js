/**
 * Created by michaelschleiss on 10.05.16.
 */
var uinput = require('uinput');

/**
 * Module exports.
 */


var setup_options = {
    EV_KEY : [ uinput.KEY_H, uinput.KEY_E, uinput.KEY_L, uinput.KEY_O, uinput.KEY_UP, uinput.KEY_DOWN ]
}

exports.buttonEvent = function(buttonName) {
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

            uinput.key_event(stream, uinput["KEY_" + buttonName], function (err) {
                if (err) {
                    throw(err);
                }
            });
        });
    });
};
