'use strict';

var response = require('./../helpers/response');
var constant = require('./../configs/constant');
var logger = require('./../libs/log');
var utils = require('./../helpers/utils');
var postModel = require('./../models/post');

var AdminController = function () { };

AdminController.addPost = function(req, res){
    var objPostData = req.body || {};
    if (typeof objPostData === "undefined") {
        response.sendError(res, constant.err_code.e0003);
        return;
    }

    if (typeof objPostData.title === "undefined" || objPostData.title == "") {
        response.sendError(res, constant.err_code.e0010);
        return;
    }

    if (typeof objPostData.content === "undefined" || objPostData.content == "") {
        response.sendError(res, constant.err_code.e0011);
        return;
    }

    postModel.insertPost(objPostData, function (err, result) {
        if (err) {
            logger.error('addPost: ' + JSON.stringify(err));
            response.sendError(res, err);
            return;
        }
        response.sendSuccess(res, result);
    });
}

module.exports = AdminController;