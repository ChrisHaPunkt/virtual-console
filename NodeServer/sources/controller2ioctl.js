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
exports.buttonEvent = function(buttonName){
    uinput.key_event(stream, uinput["KEY_" + buttonName], function (err) {
        if (err) {
            throw(err);
        }
    });
};