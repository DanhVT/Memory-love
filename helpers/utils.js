'use strict';
var crypto = require('crypto');
var fs = require("fs");
var path = require("path");
var request = require('request');
var util = require('util');

/**
 * @Constructor
 */
var Utils = function () {
};

/**
 * create secret key.
 * @return {string} 
 */
Utils.getSecret = function() {
    var defaultSecret = '8c2505f9cac85f45489cffffd7e37f73c8d5836db5ab28b01f3cccd4d7c6bb11e55228e0a5bfd20ccccbc5120ffa81fc2f6a16559ea35c0718e37947693073d3';
    var fileName = 'secret';
    var filePath = path.join(__dirname, "../data/" + fileName);
    try {
        var secret = '';
        if(fs.existsSync(filePath)) {
            secret = fs.readFileSync(filePath).toString();
        }
        if(secret.length == 0) {
            secret = defaultSecret;
        }
        const hmac = crypto.createHmac('sha512', secret);
        secret = hmac.digest('hex');
        fs.writeFileSync(filePath, secret);
        return secret;
    }
    catch(ex) {
        console.log('[ERROR] Cannot Read/Write to file: ', filePath);
        return defaultSecret;
    }
}


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