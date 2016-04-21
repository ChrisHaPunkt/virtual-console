/**
 * Created by chris on 19.04.2016.
 */


var config = require('../../../config.json');
var debug = config.debug;
var util = require('util');


function RouteVO(TYPE, name, url, displayName) {

    var TYPES = require('../Routes').TYPES;

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


    this.type = TYPE;
    this.urlId = url;
    this.unique_name = name;
    this.namespace = namespace;
    this.displayName = displayName;
    this.rel_url = "/games/" + namespace + "/" + url;


    this.fullUrl = (config.runningPort == 80 || config.runningPort == 443) ?
    config.runningProtocoll + '://' + config.runningHost + "/games/" + this.rel_url :
    config.runningProtocoll + '://' + config.runningHost + ':' + config.runningPort + this.rel_url;


    if (debug) util.log("Route Obj created | Type :'" + namespace + "'");
    if (debug) util.log("Route Obj created | DisplayName :'" + displayName + "'");
    if (debug) util.log("Route Obj created | Name :'" + name + "'");
    if (debug) util.log("Route Obj created | Url :'" + url + "'");
}

RouteVO.prototype.validate = function () {
    return typeof this.type != 'undefined' &&
        typeof this.unique_name != 'undefined' &&
        typeof this.namespace != 'undefined' &&
        typeof this.displayName != 'undefined' &&
        typeof this.urlId != 'undefined' &&
        typeof this.rel_url != 'undefined' &&
        typeof this.fullUrl != 'undefined'

};
RouteVO.prototype.strip = function () {
    delete this.fullUrl;
    delete this.rel_url;
    return this;
};

module.exports = RouteVO;