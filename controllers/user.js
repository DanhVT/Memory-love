'use strict';

var response = require('./../helpers/response');
var constant = require('./../configs/constant');
var UserModel = require('./../models/user');
var logger = require('./../libs/log');
var utils = require('./../helpers/utils');

var UserController = function () { };

UserController.isLoggedIn = function (req) {
    if (typeof req.session == "undefined") return false;
    if (typeof req.session.userInfo != "object" || req.session.userInfo == null) return false;
    if (typeof req.session.userInfo.isLoggedIn !== "boolean") return false;
    if (req.session.userInfo.isLoggedIn !== true) return false;
    return true;
}

UserController.login = function (req, res) {
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
            response.sendError(res, err);
            return;
        }
        var sessionData = {
            _id: result._id,
            roleIds: result.roleIds,
            email: result.email,
            isLoggedIn: true
        };

        req.session.userInfo = sessionData;

        response.sendSuccess(res, sessionData);
    });
};

UserController.logout = function(req, res){
    if(UserController.isLoggedIn(req)) {
        utils.cleanUp(req.session.userInfo);
    }
    return res.redirect("/login");
}
module.exports = UserController;