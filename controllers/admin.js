'use strict';

var response = require('./../helpers/response');
var constant = require('./../configs/constant');
var logger = require('./../libs/log');
var utils = require('./../helpers/utils');
var postModel = require('./../models/post');
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');

var AdminController = function () { };

AdminController.addPost = function (req, res) {
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
AdminController.addImages = function (req, res) {
    // create an incoming form object
    var form = new formidable.IncomingForm();
    var postId, fields = [];
    var destiUrl = '';
    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;
    // store all uploads in the /uploads directory
    form.uploadDir = utils.global[constant.global.uploadDir]
    // rename it to it's orignal name

    form.on('field', function (field, value) {
        console.log('############ on Field ######### ' + field + " : " + value);
        if (field == 'postId') {
            postId = value;
        }
        fields.push([field, value]);
    })
    form.on('file', function (field, file) {
        
        fs.rename(file.path, path.join(form.uploadDir, file.name));
        destiUrl =  '/uploads/'+file.name;
        fields.push([field, destiUrl]);
    });
    // log any errors that occur
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
        response.sendSuccess(res, destiUrl);
    });

    // parse the incoming request containing the form data
    form.parse(req);
}

module.exports = AdminController;