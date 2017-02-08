'use strict';

var response = require('./../helpers/response');
var UserModel = require('../../models/user');

var UserController =function(){};

User.login = function (req, res) {
    var objPostData = req.body || {};

    if (typeof objPostData === "undefined") {
        response.sendError(res, constant.err_code.e0003);
        return;
    }

    if (typeof objPostData.email === "undefined") {
        response.sendError(res, constant.err_code.e0004);
        return;
    }

    if (typeof objPostData.password === "undefined") {
        response.sendError(res, constant.err_code.e0007);
        return;
    }

    UserModel.findUser(objPostData.email, objPostData.password, function (err, result) {
        if (err) {
            logger.error('findUser: ' + JSON.stringify(err));
            response.sendError(res, constant.err_code.e0008);
            return;
        }

        response.sendSuccess(res, result);
    });
};

module.exports = UserController;