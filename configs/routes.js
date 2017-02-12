'use strict';

var express = require('express');
var router = express.Router();

var UserController = require("./../controllers/user");
var AdminController = require("./../controllers/admin");

var PostModel = require("./../models/post");

//======================================
router.get('/', function (req, res) {
    PostModel.findAllPost(function(error, result){
        return res.render("home", {
           title: "Memory love",
            error: error,
            result: result
        });
    })
});
//======================================
router.get('/post/:id', function (req, res) {
    var id = req.params.id;
    PostModel.findAllImagesOfPost(id, function(error, result){
        console.log(error, result)
        return res.render("post_detail_home", {
            title: "Post Detail",
            error: error,
            result: result
        });
    })
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
    PostModel.findAllPost(function(error, result){
        return res.render("admin", {
            title: "Dashboard",
            error: error,
            result: result
        });
    })
    
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
router.get('/admin/post/:id', function (req, res) {
    if (!UserController.isLoggedIn(req)) {
        return res.redirect("/login");
    }
    var id = req.params.id;
    PostModel.findAllImagesOfPost(id, function(error, result){
        console.log(error, result)
        return res.render("post_detail_admin", {
            title: "Post Detail",
            error: error,
            result: result
        });
    })
    
})

//======================================
router.get('/logout', UserController.logout);
//======================================
router.get('/getListPost', AdminController.getListPost);
//======================================
router.post('/loginSubmit', UserController.login);
//======================================
router.post('/admin/addSubmit', AdminController.addPost);
//======================================
router.post('/admin/addImagesSubmit', AdminController.addImages);
//======================================
router.post('/admin/deletePost', AdminController.deletePost);
//======================================
router.post('/admin/deleteImage', AdminController.deleteImage);
module.exports = router;