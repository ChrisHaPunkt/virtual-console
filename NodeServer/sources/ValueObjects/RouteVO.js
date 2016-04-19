/**
 * Created by chris on 19.04.2016.
 */

var TYPES = require('../Routes').TYPES;
var config = require('../../../config.json');
var debug = config.debug;
var util = require('util');
function RouteVO(TYPE, name, url, displayName) {

    var namespace = "";
    switch (TYPE) {
        case TYPES.internal:
            namespace = "internal";
            break;
        case TYPES.external:
            namespace = "external";
            break;
        case TYPES.native:
            namespace = "native";
            break;
        default:
            namespace = "BROKEN";
            break;
    }
    if (debug) util.log("Route Obj created | Type :'" + namespace + "'");
    if (debug) util.log("Route Obj created | DisplayName :'" + displayName + "'");
    if (debug) util.log("Route Obj created | Name :'" + name + "'");
    if (debug) util.log("Route Obj created | Url :'" + url + "'");

    this.type = TYPE;
    this.name = name;
    this.namespace = namespace;
    this.displayName = displayName;
    this.url = namespace + "/" + name;
    this.fullUrl = (config.runningPort == 80 || config.runningPort == 443) ?
    config.runningProtocoll + '://' + config.runningHost + "/games/" + this.url :
    config.runningProtocoll + '://' + config.runningHost + ':' + config.runningPort + "/games/" + this.url;

    this.validate = function () {
        return typeof this.type  != 'undefined' &&
            typeof this.name != 'undefined' &&
            typeof this.namespace != 'undefined' &&
            typeof this.displayName != 'undefined' &&
            typeof  this.url != 'undefined' &&
            typeof this.fullUrl != 'undefined'

    }
}


module.exports = RouteVO;