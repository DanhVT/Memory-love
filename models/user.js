'use strict';
var crypto = require('crypto');
var utils = require('./../helpers/utils');
var constant = require('./../configs/constant');
var UserModel = function() {};

const USER_ROLE_ADMIN = 1;
const USER_ROLE_CLIENT = 2;

const USER_AUTH_NEW = 1;
const USER_AUTH_APPROVED = 2;
const USER_AUTH_REJECTED = 3;
const USER_AUTH_DISABLED = 4

/**
 * Get address collection
 */
UserModel.getUserCollection = function() {
    return utils.global[constant.global.db].collection(constant.table.user);
};

UserModel.checkDefaultAdmin = function (callback) {	
    const DEFAULT_ADMIN = "admin@admin.com";
    const DEFAULT_ADMIN_PASS = "pass";

    UserModel.getUserCollection().find( { roleIds: { $elemMatch: { $eq: USER_ROLE_ADMIN } } } ).toArray(function(err, docs){
        if(err) {
            logger.error("UserModel.checkDefaultAdmin => query fail: " + err.toString());
        }

        if(docs.length > 0) return callback(null);	// exists

        var salt = utils.getSecret();

        UserModel.getUserCollection().insert({
            roleIds: [USER_ROLE_ADMIN],
            email: DEFAULT_ADMIN,
            password: UserModel.generatePassword(DEFAULT_ADMIN_PASS, salt),
            salt: salt,
            firstName: "Administrator",
            lastName: "",
            kycId: "",
            altaId: "",
            url: "",
            status: USER_AUTH_APPROVED,
            created: new Date(), 
            updated: new Date(),
            lastLogin: new Date(), 
            forgotHash: "",
            sessions: []
        }, function(err, docs){
            if(err) {
                logger.error("UserModel.checkDefaultAdmin => insert admin failed: " + err.toString());
            }

            return callback(null);	// insert success
        });
    });
}

/**
 * Generate encrypted password.
 * @param {string} strPassword
 * @param {string} strSalt
 * @return {string} 
 */
UserModel.generatePassword = function(strPassword, strSalt) {
	const hmac = crypto.createHmac('sha512', strPassword + strSalt);
	return hmac.digest('hex');
}


UserModel.findUser = function(email, password, callback) {
    UserModel.getUserCollection().find({ 'email': email }).toArray(function(err, docs){
        if(err) {
            logger.error("UserModel.login => Cannot get data for email: " + objPostData.email + ". System error return: " + err.toString());
            return callback(constant.err_code.e0002);
        }
        if(docs.length <=0 ) return callback(constant.err_code.e0006);

        var userInfo = docs[0];

        if(userInfo.status == USER_AUTH_NEW) return callback(new CustomError('ACCOUNT_NOT_APPROVED', 'Account is not approved'));	// new register

        if(userInfo.status == USER_AUTH_REJECTED) return callback(new CustomError('ACCOUNT_REJECTED', 'Account is rejected'));	// REJECTED

        if(userInfo.status == USER_AUTH_DISABLED) return callback(new CustomError('ACCOUNT_DISABLED', 'Account is disable.'));	// DISABLED

        if(userInfo.password != UserModel.generatePassword(password, userInfo.salt)) {
            
        }
    });
};

module.exports = UserModel;