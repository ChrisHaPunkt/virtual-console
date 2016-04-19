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
        case 1:
            namespace = "internal";
            break;
        case 2:
            namespace = "external";
            break;
        case 3:
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

    var buildFullUri = (config.runningPort == 80 || config.runningPort == 443) ?
    config.runningProtocoll + '://' + config.runningHost + "/games/" + this.rel_url :
    config.runningProtocoll + '://' + config.runningHost + ':' + config.runningPort + "/games/" + this.rel_url;

    this.type = TYPE;
    this.unique_name = name;
    this.namespace = namespace;
    this.displayName = displayName;
    this.rel_url = namespace + "/" + name;
    this.fullUrl = buildFullUri;

    this.validate = function () {
        return typeof this.type != 'undefined' &&
            typeof this.unique_name != 'undefined' &&
            typeof this.namespace != 'undefined' &&
            typeof this.displayName != 'undefined' &&
            typeof this.rel_url != 'undefined' &&
            typeof this.fullUrl != 'undefined'

    }
}


module.exports = RouteVO;