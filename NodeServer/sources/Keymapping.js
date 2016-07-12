/**
 * Created by michaelschleiss on 10.05.16.
 */
var os = require('os');
var debug = require('../../config.json').debug;
var util = require('util');


var Database = require('./Database')();

var Keymapping = {
    MAP: {},
    init: function (ready) {
        if (debug) util.log("Init Keymapping Cache...");
        var that = this;
        this.createKeymappingFromDB(function (success) {
            if (success) {
                if (typeof ready == "function")
                    ready(that.MAP);
            } else {
                console.error("Error Keymapping init");
            }
            if (debug) util.log("Init Keymapping Cache... Finished");
        })

    },
    createKeymappingFromDB: function (onSuccess) {
        var that = this;
        var query = {keymapping: {$exists: true, $nin: [{}]}};

        var queryCallback = function (state, users) {
            if (debug) util.log("Got Keymappings for", users.length, "Users");
            if (state) {

                //   util.log(users);

                users.forEach(function (user) {
                    that.MAP[user.name] = {};
                    for (var game in user.keymapping) {
                        // skip loop if the property is from prototype
                        if (!user.keymapping.hasOwnProperty(game)) continue;

                        // your code
                        //     util.log(user.name, game + " = " , user.keymapping[game]);
                        that.MAP[user.name][game] = user.keymapping[game];
                    }

                });
                onSuccess(true);
            } else {
                onSuccess(false, "No Games present in DB");
            }
        };
        Database.query("userData", query, queryCallback);
    },

    defaultMapping: {
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
    },

    getDefaultHWKeyMapping: function (buttonName) {

        return this.defaultMapping[buttonName];
    },
    getKeyMappingByUserGame: function (gameID, playerID, buttonName) {

        if (debug) util.log("Request HW-Button '" + buttonName + "' for player '" + playerID + "' in game '" + gameID + "'");
        try {
            return this.MAP[playerID][gameID][buttonName];
        } catch (e) {
            if (debug) util.log("No entry for this game and this player, delivering default...");
            return this.defaultMapping[buttonName];
        }
    },

    getMapForUser: function (user) {
        return this.MAP[user] || {"GAME": this.defaultMapping};
    },

    updateMapForUser: function (user, map) {

        if (typeof map != 'object')
            map = JSON.parse(map);

        //tempupdate
        this.MAP[user] = map;

        var query = {name: user};

        var callback = function (state, msg) {
            //The user exist
            if (state == true && msg[0]) {
                var dbuser = msg[0];
                if (debug) util.log(msg[0]);
                dbuser["keymapping"] = map;

                Database.remove("userData", query, function () {

                    Database.insert("userData", dbuser, function () {

                        if (debug) util.log("User updated: ", dbuser);

                    });
                });


                //Database.update("userData", query, msg[0]);
            } else {
                if (debug) util.log("Cannot update map, user " + user + " not fount in db");
            }
        };
        Database.query("userData", query, callback);
        this.init();
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
if (os.platform() == 'linux') {
    try {
        var uinput = require('uinput');
        Keymapping.HWSUPP = true;
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
                uinput.KEY_O,
                uinput.KEY_C,
                uinput.KEY_D,
                uinput.KEY_E,
                uinput.KEY_F,
                uinput.KEY_G,
                uinput.KEY_H,
                uinput.KEY_I,
                uinput.KEY_J,
                uinput.KEY_K,
                uinput.KEY_L,
                uinput.KEY_M,
                uinput.KEY_N,
                uinput.KEY_P,
                uinput.KEY_Q,
                uinput.KEY_R,
                uinput.KEY_S,
                uinput.KEY_T,
                uinput.KEY_U,
                uinput.KEY_V,
                uinput.KEY_W,
                uinput.KEY_X,
                uinput.KEY_1,
                uinput.KEY_2,
                uinput.KEY_3,
                uinput.KEY_4,
                uinput.KEY_5,
                uinput.KEY_6,
                uinput.KEY_7,
                uinput.KEY_8,
                uinput.KEY_9,
                uinput.KEY_0]
        }
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
    } catch (e) {
        console.error("FATAL, cannot load uinput on unix system");

    }
}
else {
    Keymapping.HWSUPP = false;
}

module.exports = Keymapping;