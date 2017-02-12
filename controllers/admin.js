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

AdminController.getListPost = function(req, res){
    postModel.findAllPost(function (err, result) {
        if (err) {
            logger.error('addPost: ' + JSON.stringify(err));
            response.sendError(res, err);
            return;
        }
        response.sendSuccess(res, result);
    });
}

AdminController.addPost = function (req, res) {
    // create an incoming form object
    var form = new formidable.IncomingForm();
    var postId, objPostData={};
    var destiUrl = '';
    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;
    // store all uploads in the /uploads directory
    form.uploadDir = utils.global[constant.global.uploadDir]
    // rename it to it's orignal name

    form.on('field', function (field, value) {
        console.log('############ on Field ######### ' + field + " : " + value);
        objPostData[field] = value;
    })
    form.on('file', function (field, file) {
        
        fs.rename(file.path, path.join(form.uploadDir, file.name));
        objPostData["featureImage"] =  '/uploads/'+file.name;
        
    });
    // log any errors that occur
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
        var data = {
            'postId': postId,
            'url': destiUrl,
            'createdDate': new Date()
        }
        postModel.insertPost(objPostData, function (err, result) {
            if (err) {
                logger.error('addPost: ' + JSON.stringify(err));
                response.sendError(res, err);
                return;
            }
            response.sendSuccess(res, result);
        });
        
    });

    // parse the incoming request containing the form data
    form.parse(req);

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
        var data = {
            'postId': postId,
            'url': destiUrl,
            'createdDate': new Date()
        }
        postModel.insertImages(data, function(error, result){
            if(error){
                response.sendError(res, "Upload file fail: " + error );
            }
            response.sendSuccess(res, destiUrl);
        })
        
    });

    // parse the incoming request containing the form data
    form.parse(req);
}

AdminController.deletePost = function(req, res){
    var objData = req.body || {};

    if(typeof objData == "undefined"){
        return response.sendError(res, constant.err_code.e0003)
    }
    if(typeof objData.id == "undefined"){
        return response.sendError(res, constant.err_code.e0004)
    }

    postModel.removePost(objData.id, function(error, result){
        if(error)
            return response.sendError(res, constant.err_code.e0002);
        response.sendSuccess(res, result);
    })
}

AdminController.deleteImage = function(req, res){
    var objData = req.body || {};

    if(typeof objData == "undefined"){
        return response.sendError(res, constant.err_code.e0003)
    }
    if(typeof objData.id == "undefined"){
        return response.sendError(res, constant.err_code.e0004)
    }

    postModel.removeImage(objData.id, function(error, result){
        if(error)
            return response.sendError(res, constant.err_code.e0002);
        response.sendSuccess(res, result);
    })
}
module.exports = AdminController;