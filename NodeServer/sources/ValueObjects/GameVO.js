/**
 * Created by chris on 19.04.2016.
 */


var config = require('../../../config.json');
var debug = config.debug;
var util = require('util');

/**
 * Erzeugt eine Insatnz einer Game-Repräsentation
 *
 * @param TYPE
 * @param name Eindeutiger Name
 * @param displayName
 * @param urlId GenerierteID für den Link-Anker
 * @constructor
 */
function GameVO(TYPE, name, displayName, urlId) {

    var TYPES = require('../Games').TYPES;

    var gameType;
    var gameName;
    var gameDisplayName;
    var gameUrlId;
    var gameContentUrl;

    if (typeof TYPE == "object") {

        gameType = TYPE.type;
        gameName = TYPE.unique_name;
        gameDisplayName = TYPE.displayName;
        gameUrlId = TYPE.urlId;
        gameContentUrl = TYPE.contentUrl;

    } else {

        gameType = TYPE;
        gameName = name;
        gameDisplayName = displayName;
        gameUrlId = urlId;

    }

    var namespace = "";
    var namespaceShort = "";
    switch (gameType) {
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

    this.type = gameType;
    if (gameUrlId)
        this.urlId = gameUrlId;
    this.unique_name = gameName;
    this.namespace = namespace;
    this.contentUrl = gameContentUrl;
    this.namespaceShort = namespaceShort;
    this.displayName = gameDisplayName;
    var genUrlId = (gameUrlId) ? gameUrlId : '{toBeGenerated}';
    this.rel_url = "/games/" + this.namespaceShort + "/" + genUrlId;

    var runningHost = config.dynamicHostname ? require('os').hostname() : config.runningHost;
    this.fullUrl = (config.runningPort == 80 || config.runningPort == 443) ?
    config.runningProtocoll + '://' + runningHost + "" + this.rel_url :
    config.runningProtocoll + '://' + runningHost + ':' + config.runningPort + this.rel_url;


   /* if (debug) util.log("Route Obj created | Type :'" + namespace + "'");
    if (debug) util.log("Route Obj created | DisplayName :'" + displayName + "'");
    if (debug) util.log("Route Obj created | Name :'" + name + "'");
    if (debug) util.log("Route Obj created | Url :'" + this.rel_url + "'");*/
}

GameVO.prototype.validate = function () {
    if (this.type == require('../Games').TYPES.external) {
        if (typeof this.contentUrl == 'undefined')
            return false;
    }
    return typeof this.type != 'undefined' &&
        typeof this.unique_name != 'undefined' &&
        typeof this.namespace != 'undefined' &&
        typeof this.namespaceShort != 'undefined' &&
        typeof this.displayName != 'undefined' &&
        typeof this.rel_url != 'undefined' &&
        typeof this.fullUrl != 'undefined'

};
GameVO.prototype.addContentUrl = function (contentUrl) {

    this.contentUrl = contentUrl;
    return this;

};
GameVO.prototype.strip = function () {
    delete this.fullUrl;
    delete this.rel_url;
    return this;
};

module.exports = GameVO;