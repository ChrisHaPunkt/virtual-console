/**
 * Created by michaelschleiss on 10.05.16.
 */
var uinput = require('uinput');

var setup_options = {
    EV_KEY : [ uinput.KEY_RIGHT, uinput.KEY_E, uinput.KEY_L, uinput.KEY_O ]
}
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

    exports.keyTest = function(buttonName) {

        setTimeout(function () {
            uinput.key_event(meinStream, uinput["KEY_" + buttonName], function (err) {
                if (err) {
                    throw(err);
                }
            });
        }, 1);
    };
});
