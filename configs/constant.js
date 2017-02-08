'use strict';

var constant = {
    global: {
        db: 'mongodb'
    },
    status: {
        pending: 'pending',
        latest: 'latest'
    },
    table: {
        user: 'User'
    },
    err_code: {
        'e0001': 'e0001',   // database error
        'e0002': 'e0002',   // no data in database
        'e0003': 'Parameters are invalid',   // 'status' field is not 'pending' or 'latest'
        'e0004': 'Email is undefined',   // parameter is undefined
        'e0005': 'Email is empty',   // parameter is invalid
        'e0006': 'Email is invalid! Please try again',   // parameter is not hexadecimal
        'e0007': 'Password is empty',   // parameter is not unsigned integer
        'e0008': 'Login failed',   // rpc error
    }
};

module.exports = constant;