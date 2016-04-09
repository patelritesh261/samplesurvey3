"use strict";
var express = require('express');
var router = express.Router();
//variable declaration
var surveyname, surveytype;
var mcqModel = require('../models/multiple');
var agreeModel = require('../models/agree');
var Mcq = mcqModel.Mcq;
var Agree = agreeModel.Agree;
/* Utility Function to check if user is authenticated */
function requireAuth(req, res, next) {
    // check if the user is logged in
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}
// GET - show main users page - list all the users
router.get('/createsurvey', requireAuth, function (req, res, next) {
    // use the Users model to query the Users collection
    Mcq.find(function (error, mcq) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // no error, we found a list of users
            res.render('multiple/createsurvey', {
                title: 'MCQ Survey',
                mcq: mcq,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});
router.post('/createsurvey', requireAuth, function (req, res, next) {
    // no error, we found a list of users
    //surveyname=req.body;
    // res.send(surveyname);
    surveyname = req.body.surveyname;
    surveytype = req.body.surveytype;
    //res.send(surveytype);
    if (surveytype === "multiple") {
        res.redirect('/multiple/add');
    }
    surveyname = req.body.surveyname;
    res.redirect('/multiple/agreeadd');
});
/* Render Registration page */
router.get('/agreeadd', function (req, res, next) {
    Agree.find(function (error, agree) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // no error, we found a list of users
            res.render('multiple/agreeadd', {
                title: 'Agree Survey',
                surveyname: surveyname,
                agree: agree,
                messages: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});
/* Process Registration Request */
router.post('/agreeadd', function (req, res, next) {
    // attempt to register user
    Agree.create({
        displayName: req.body.displayName,
        surveyName: req.body.surveyname,
        question: req.body.question,
        option1: 'Agree',
        option2: 'Disagree',
    }, function (error, User) {
        // did we get back an error or valid Article object?
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            res.redirect('/multiple/agreeadd');
        }
    });
});
/* Render Registration page */
router.get('/add', function (req, res, next) {
    Mcq.find(function (error, mcq) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // no error, we found a list of users
            res.render('multiple/add', {
                title: 'MCQ Survey',
                surveyname: surveyname,
                mcq: mcq,
                messages: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});
/* Process Registration Request */
router.post('/add', function (req, res, next) {
    // attempt to register user
    Mcq.create({
        displayName: req.body.displayName,
        surveyName: req.body.surveyname,
        question: req.body.question,
        option1: req.body.option1,
        option2: req.body.option2,
        option3: req.body.option3,
        option4: req.body.option4,
    }, function (error, User) {
        // did we get back an error or valid Article object?
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            res.redirect('/multiple/add');
        }
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
router.get('/add/:id', requireAuth, function (req, res, next) {
    var id = req.params.id;
    Mcq.findById(id, function (error, Mcq) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            //show the edit view
            res.render('multiple/edit', {
                title: 'User Details',
                mcq: Mcq,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});
// POST edit page - update the selected user
router.post('/add/:id', requireAuth, function (req, res, next) {
    // grab the id from the url parameter
    var id = req.params.id;
    // create and populate a user object
    var mcq = new Mcq({
        _id: id,
        displayName: req.body.displayName,
        surveyName: req.body.surveyname,
        question: req.body.question,
        option1: req.body.option1,
        option2: req.body.option2,
        option3: req.body.option3,
        option4: req.body.option4
    });
    // run the update using mongoose and our model
    Mcq.update({ _id: id }, mcq, function (error) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // if update is successful redirect to the users page
            res.redirect('/multiple/add');
        }
    });
});
// GET edit page - show the current user in the form
router.get('/surveyname/', requireAuth, function (req, res, next) {
    res.send('Error');
    /*var id = req.params.id;

   var ds=req.user.displayName ;
   Mcq.find(Mcq,{displayName:ds},{surveyName:id},(error, mcq) => {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            //show the edit view
            res.render('multiple/', {
                title: 'User Details',
                mcq: Mcq,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });*/
});
// GET delete user
router.get('/delete/:id', requireAuth, function (req, res, next) {
    // get the id from the url
    var id = req.params.id;
    // use the model and delete this record
    Mcq.remove({ _id: id }, function (error) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // if removal worked redirect to users page
            res.redirect('/multiple/add');
        }
    });
});
// make this public
module.exports = router;

//# sourceMappingURL=multiple.js.map
