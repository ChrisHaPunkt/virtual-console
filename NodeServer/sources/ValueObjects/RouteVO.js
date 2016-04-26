/**
 * Created by chris on 19.04.2016.
 */


var config = require('../../../config.json');
var debug = config.debug;
var util = require('util');


function RouteVO(TYPE, name, displayName, urlId) {

    var TYPES = require('../Routes').TYPES;

    var namespace = "";
    var namespaceShort = "";
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
    namespaceShort = namespace.substr(0, 3);

    this.type = TYPE;
    if (urlId)
        this.urlId = urlId;
    this.unique_name = name;
    this.namespace = namespace;
    this.namespaceShort = namespaceShort;
    this.displayName = displayName;
    var genUrlId = (urlId) ? urlId :'{toBeGenerated}';
    this.rel_url = "/games/" + this.namespaceShort + "/" + genUrlId;

    this.fullUrl = (config.runningPort == 80 || config.runningPort == 443) ?
    config.runningProtocoll + '://' + config.runningHost + "/games/" + this.rel_url :
    config.runningProtocoll + '://' + config.runningHost + ':' + config.runningPort + this.rel_url;


    if (debug) util.log("Route Obj created | Type :'" + namespace + "'");
    if (debug) util.log("Route Obj created | DisplayName :'" + displayName + "'");
    if (debug) util.log("Route Obj created | Name :'" + name + "'");
    if (debug) util.log("Route Obj created | Url :'" + this.rel_url + "'");
}

RouteVO.prototype.validate = function () {
    return typeof this.type != 'undefined' &&
        typeof this.unique_name != 'undefined' &&
        typeof this.namespace != 'undefined' &&
        typeof this.namespaceShort != 'undefined' &&
        typeof this.displayName != 'undefined' &&
        typeof this.rel_url != 'undefined' &&
        typeof this.fullUrl != 'undefined'

};
RouteVO.prototype.strip = function () {
    delete this.fullUrl;
    delete this.rel_url;
    return this;
};

module.exports = RouteVO;