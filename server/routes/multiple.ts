import express = require('express');
import passport = require('passport');
var router = express.Router();


//variable declaration
var surveyname;
// db references
import mongoose = require('mongoose');
import mcqModel = require('../models/multiple');

import Mcq = mcqModel.Mcq;

/* Utility Function to check if user is authenticated */
function requireAuth(req:express.Request, res:express.Response, next: any) {
    // check if the user is logged in
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}

// GET - show main users page - list all the users
router.get('/createsurvey', requireAuth, (req: express.Request, res: express.Response, next: any) => {
   
    // use the Users model to query the Users collection
    Mcq.find((error, mcq) => {
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
router.post('/createsurvey', requireAuth, (req: express.Request, res: express.Response, next: any) => {
   
    
            // no error, we found a list of users
          
                
                surveyname=req.body.surveyname;
               
                res.redirect('/multiple/add');
       
    
});

/* Render Registration page */
router.get('/add', (req:express.Request, res: express.Response, next:any) => {
        Mcq.find((error, mcq) => {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // no error, we found a list of users
            res.render('multiple/add', {
                title: 'MCQ Survey',
                surveyname:surveyname,
                mcq: mcq,
               messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : ''
            
            });
        }
    });
        
       
});

/* Process Registration Request */
router.post('/add', (req:express.Request, res: express.Response, next:any) => {
    // attempt to register user
    Mcq.create({
        displayName: req.body.displayName,
        surveyName: req.body.surveyname,
        question: req.body.question,
        option1: req.body.option1,
        option2: req.body.option2,
        option3: req.body.option3,
        option4: req.body.option4,
    }, function(error, User) {
        // did we get back an error or valid Article object?
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            res.redirect('/multiple/add');
        }
    })
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
router.get('/add/:id', requireAuth, (req: express.Request, res: express.Response, next: any) => {

    var id = req.params.id;

    Mcq.findById(id, (error, Mcq) => {
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
router.post('/add/:id', requireAuth, (req: express.Request, res: express.Response, next: any) => {

    // grab the id from the url parameter
    var id = req.params.id;

    // create and populate a user object
    var mcq = new Mcq({
        _id: id,
        displayName:req.body.displayName,
        surveyName: req.body.surveyname,
        question: req.body.question,
        option1: req.body.option1,
         option2: req.body.option2,
          option3: req.body.option3,
           option4: req.body.option4
    });
    
    

    // run the update using mongoose and our model
    Mcq.update({ _id: id }, mcq, (error) => {
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

// GET delete user
router.get('/delete/:id', requireAuth, (req: express.Request, res: express.Response, next: any) => {

    // get the id from the url
    var id = req.params.id;

    // use the model and delete this record
    Mcq.remove({ _id: id }, (error) => {
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