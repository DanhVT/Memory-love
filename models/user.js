var UserModel = function() {};

/**
 * Get address collection
 */
UserModel.getUserCollection = function() {
    return utils.global[constant.global.db].collection(constant.table.user);
};

UserModel.findUser = function(email, password, callback) {
    UserModel.getUserCollection().findOne({ 'email': email, 'password': password }, function(err, result) {
        callback(err, result);
    });
};

module.exports = UserModel;