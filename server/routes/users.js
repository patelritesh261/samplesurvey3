"use strict";
var express = require('express');
var passport = require('passport');
var router = express.Router();
var userModel = require('../models/user');
var mcqModel = require('../models/multiple');
var User = userModel.User;
var Mcq = mcqModel.Mcq;
/* Utility Function to check if user is authenticated */
function requireAuth(req, res, next) {
    // check if the user is logged in
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}
// GET - show main users page - list all the users
router.get('/', requireAuth, function (req, res, next) {
    // use the Users model to query the Users collection
    User.find(function (error, users) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            var ds = req.user.displayName;
            Mcq.distinct("surveyName", { displayName: ds }, function (error, mcq) {
                if (error) {
                    console.log(error);
                    res.end(error);
                }
                else {
                    // no error, we found a list of users
                    res.render('users/index', {
                        title: 'Users',
                        users: users,
                        mcq: mcq,
                        displayName: req.user ? req.user.displayName : ''
                    });
                }
            });
        }
    });
});
/* Render Registration page */
router.get('/add', function (req, res, next) {
    res.render('users/add', {
        title: 'Register',
        messages: req.flash('registerMessage'),
        displayName: req.user ? req.user.displayName : ''
    });
});
/* Process Registration Request */
router.post('/add', function (req, res, next) {
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
            return res.render('users/add', {
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
// GET add page - show the blank form
/*router.get('/add', requireAuth, (req: express.Request, res: express.Response, next: any) => {
    res.render('users/add', {
        title: 'Add a New User',
        displayName: req.user ? req.user.displayName : ''
    });
});

// POST add page - save the new user
router.post('/add', requireAuth, (req: express.Request, res: express.Response, next: any) => {
    User.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        displayName: req.body.displayName
    }, (error, User) => {
        // did we get back an error or valid Users object?
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            res.redirect('/users');
        }
    })
});*/
// GET edit page - show the current user in the form
router.get('/:id', requireAuth, function (req, res, next) {
    var id = req.params.id;
    User.findById(id, function (error, User) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            //show the edit view
            res.render('users/edit', {
                title: 'User Details',
                user: User,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});
// POST edit page - update the selected user
router.post('/:id', requireAuth, function (req, res, next) {
    // grab the id from the url parameter
    var id = req.params.id;
    // create and populate a user object
    var user = new User({
        _id: id,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        displayName: req.body.displayName
    });
    // run the update using mongoose and our model
    User.update({ _id: id }, user, function (error) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // if update is successful redirect to the users page
            res.redirect('/users');
        }
    });
});
// GET delete user
router.get('/delete/:id', requireAuth, function (req, res, next) {
    // get the id from the url
    var id = req.params.id;
    // use the model and delete this record
    User.remove({ _id: id }, function (error) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // if removal worked redirect to users page
            res.redirect('/users');
        }
    });
});
// make this public
module.exports = router;

//# sourceMappingURL=users.js.map
