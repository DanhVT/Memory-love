'use strict';

var express = require('express');
var router = express.Router();

var UserController = require("./../controllers/user");
var AdminController = require("./../controllers/admin");

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
router.get('/admin', function (req, res) {
    if (!UserController.isLoggedIn(req)) {
        return res.redirect("/login");
    }
    return res.render("admin", {
        title: "Dashboard"
    });
})

//======================================
router.get('/admin/add', function (req, res) {
    if (!UserController.isLoggedIn(req)) {
        return res.redirect("/login");
    }
    return res.render("add_post", {
        title: "Dashboard Add post"
    });
})

//======================================
router.get('/logout', UserController.logout);
//======================================
router.post('/loginSubmit', UserController.login);
//======================================
router.post('/admin/addSubmit', AdminController.addPost);
//======================================
router.post('/admin/addImagesSubmit', AdminController.addImages);

module.exports = router;