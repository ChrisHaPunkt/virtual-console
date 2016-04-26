/**
 * Created by chrisheinrichs on 26.04.16.
 */


var config = require('../../../config.json');
var debug = config.debug;
var util = require('util');


function RouteVO(TYPE, name, displayName, urlId) {

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