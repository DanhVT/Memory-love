'use strict';
var utils = require('./../helpers/utils');
var constant = require('./../configs/constant');
var PostModel = function() {};

/**
 * Get Post collection
 */
PostModel.getPostCollection = function() {
    return utils.global[constant.global.db].collection(constant.table.post);
};

PostModel.insertPost = function(data, callback){
    PostModel.getPostCollection().insert(data, function (err, result) {
        callback(err, result);
    });
}

module.exports = PostModel;
