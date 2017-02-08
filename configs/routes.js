'use strict';

var express = require('express');
var router = express.Router();

var UserController = require("./../controllers/user");

//======================================
router.get('/', function (req, res) {
    return res.render("home", {
        title: "Memory love"
    });
});

//======================================
router.get('/login', function (req, res) {
    return res.render("login", {
        title: "Login"
    });
})

//======================================
router.post('/login', UserController.login);

module.exports = router;