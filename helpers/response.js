'use strict';

/**
 * @Constructor
 */
var Response = function () {
};

/**
 * Return error to client
 */
Response.sendError = function (res, error) {
    res.send({ state: 'error', error: error });
};

/**
 * Return success to client
 */
Response.sendSuccess = function (res, result) {
    res.send({ state: 'success', result: result });
};

module.exports = Response;