'use strict';
var utils = require('./../helpers/utils');
var constant = require('./../configs/constant');
var PostModel = function() {};
var ObjectId = require('mongodb').ObjectID;

/**
 * Get Post collection
 */
PostModel.getPostCollection = function() {
    return utils.global[constant.global.db].collection(constant.table.post);
};

PostModel.getImagesCollection = function() {
    return utils.global[constant.global.db].collection(constant.table.images);
};

PostModel.insertPost = function(data, callback){
    PostModel.getPostCollection().insert(data, function (err, result) {
        callback(err, result);
    });
}

PostModel.insertImages = function(data, callback){
    PostModel.getImagesCollection().insert(data, function (err, result) {
        callback(err, result);
    });
}

PostModel.findAllPost = function(callback){
    PostModel.getPostCollection().find({}).toArray(function(error, data){
        if(error) return callback(constant.err_code.e0002);
        if(data.length <=0) return callback('Not found');
        callback(null, data);
    })
}

PostModel.findPostById = function(id, callback){
    PostModel.getPostCollection().findOne({_id: ObjectId(id)},function(error, data){
        if(error) return callback(constant.err_code.e0002);
        if(data.length <=0) return callback('Not found Post');
        callback(null, data);
    })
}

PostModel.findAllImagesOfPost = function(postId, callback){
    PostModel.findPostById(postId, function(error, post){
        if(error) return callback(error);
        PostModel.getImagesCollection().find({postId: postId}).toArray(function(error, data){
            if(error) return callback(constant.err_code.e0002);
            callback(null, {'post': post, 'images': data});
        })
    })
}

PostModel.removePost = function(id, callback){
    PostModel.getPostCollection().remove({_id: ObjectId(id)}, function(error, result){
        callback(error, result)
    })
}

PostModel.removeImage = function(id, callback){
    PostModel.getImagesCollection().remove({_id: ObjectId(id)}, function(error, result){
        callback(error, result)
    })
}
module.exports = PostModel;
