'use strict';

var util = require('util');

/**
 * @Constructor
 */
var Utils = function () {
};

/**
 * Return a formatted string using the first argument as a printf-like format.
 */
Utils.format = util.format;

/**
 * Set variable to use global
 */
Utils.global = global;

/**
 * Return true if POST data is undefined
 */
Utils.isUndefinedParam = function (req, params) {
    for (var i = 0; i < params.length; i++) {
        if (typeof (req.body[params[i]]) == 'undefined') {
            return true;
        }
    }

    return false;
};

/**
 * Return true if value belong to enum type
 */
Utils.isEnumType = function (value, enumObj) {
    for (var key in enumObj) {
        if (value == enumObj[key]) {
            return true;
        }
    }

    return false;
};

/**
 * Return true if str is hexadecimal
 */
Utils.isHexadecimal = function (str) {
    return /^[0-9a-fA-F]+$/.test(Utils.strip0x(str));
};

/**
 * Return true if value is integer
 */
Utils.isInteger = function (str) {
    return /^-?[0-9]+$/.test(str);
};

/**
 * Return true if value is unsigned integer
 */
Utils.isUnsignedInteger = function (str) {
    return /^[0-9]+$/.test(str);
};


module.exports = Utils;