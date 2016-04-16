"use strict";
var express = require('express');
var sendgrid = require('sendgrid')('ACCOUNT_NAME', 'PASSWORD');
var passport = require('passport');
var router = express.Router();
// db references
var userModel = require('../models/user');
var User = userModel.User;
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Home',
        displayName: req.user ? req.user.displayName : '' });
});
/* GET product page. */
router.get('/products', function (req, res, next) {
    res.render('index', {
        title: 'Products',
        displayName: req.user ? req.user.displayName : '' });
});
/* GET services page. */
router.get('/services', function (req, res, next) {
    res.render('index', {
        title: 'Services',
        displayName: req.user ? req.user.displayName : '' });
});
/* GET about page. */
router.get('/about', function (req, res, next) {
    res.render('about', {
        title: 'About',
        displayName: req.user ? req.user.displayName : '' });
});
/* GET about page. */
router.get('/test', function (req, res, next) {
    res.render('test', {
        title: 'About',
        displayName: req.user ? req.user.displayName : '' });
});
/* GET contact page. */
router.get('/contact', function (req, res, next) {
    req.flash('successmessage', 'Thank You. Your message has been sent.');
    req.flash('errormessage', 'An Error has occurred.');
    res.render('contact', {
        title: 'Contact',
        messages: null,
        displayName: req.user ? req.user.displayName : '' });
});
/* Email processing */
router.post('/contact', function (req, res, next) {
    var sendgrid = require("sendgrid")("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");
    var email = new sendgrid.Email();
    email.addTo("patelritesh261@gmail.com");
    email.setFrom(req.body.email);
    email.setSubject("Contact Form Submission");
    email.setHtml("<html><body><main><h2>HI " + req.body.name + ",</main><h4>This message has been sent from the contact form at Sample Surveysite</h4><table><tr><td>" + "Name: " + req.body.name + "</td></tr><tr><td>" + "Phone: " + req.body.phone + "</td></tr><tr><td colspan=2>" + "Message : " + req.body.message + "</td></tr></table>Thank you</body></html>");
    //email.setHtml("/respond/"+ss.displayName+"/"+ss.surveyType+"/"+ss.surveyName);
    sendgrid.send(email);
    res.render('contact', {
        title: 'Contact',
        messages: 'Thank you, we will contact as soon as possible.',
        displayName: req.user ? req.user.displayName : ''
    });
});
/* Render Login Page */
router.get('/login', function (req, res, next) {
    if (!req.user) {
        res.render('login', {
            title: 'Login',
            messages: req.flash('loginMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
        return;
    }
    else {
        return res.redirect('/users');
    }
});
/* Process Login Request */
router.post('/login', passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/loginFailure',
    failureFlash: true,
    failureMessage: "Invalid username or password",
    messages: "Invalid username or password"
}));
router.get('/loginFailure', function (req, res, next) {
    req.flash('loginMessage', 'Invalid UserName Or Password.');
    res.redirect('/login');
});
/* Render Password Reset page */
router.get('/reset', function (req, res, next) {
    if (req.user) {
        res.render('reset', {
            title: 'Reset',
            displayName: req.user ? req.user.displayName : ''
        });
    }
    else {
        return res.redirect('/login');
    }
});
/* Process Password Reset Request */
router.post('/reset', function (req, res, next) {
    console.log(req.user.username);
    User.findOne({ 'username': req.user.username }, function (err, user) {
        user.setPassword(req.body.password, function (err) {
            if (err) {
                console.log(err);
                next(err);
            }
            else {
                user.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('Password Changed');
                    res.redirect('/users');
                });
            }
        });
    });
});
/* Render Registration page */
router.get('/register', function (req, res, next) {
    if (!req.user) {
        res.render('register', {
            title: 'Register',
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
        return;
    }
    else {
        return res.redirect('/');
    }
});
/* Process Registration Request */
router.post('/register', function (req, res, next) {
    // attempt to register user
    User.register(new User({ username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        displayName: req.body.displayName
    }), req.body.password, function (err) {
        if (err) {
            console.log('Error Inserting New Data');
            if (err.name == 'UserExistsError') {
                req.flash('registerMessage', 'Registration Error: User Already Exists!');
            }
            return res.render('register', {
                title: 'Register',
                messages: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName : ''
            });
        }
        // if registration is successful
        return passport.authenticate('local')(req, res, function () {
            res.redirect('/users');
        });
    });
});
/* Process Logout Request */
router.get('/logout', function (req, res) {
    req.logOut();
    res.redirect('/login');
});
module.exports = router;

//# sourceMappingURL=index.js.map
