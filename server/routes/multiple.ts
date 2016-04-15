import express = require('express');
import passport = require('passport');
var router = express.Router();


//variable declaration
var surveyname,surveytype;
// db references
import mongoose = require('mongoose');
import mcqModel = require('../models/multiple');
import agreeModel = require('../models/agree');

import Mcq = mcqModel.Mcq;
import Agree = agreeModel.Agree;
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
          
   //surveyname=req.body;
               // res.send(surveyname);
               surveyname=req.body.surveyname;
              surveytype=req.body.surveytype;
              
              //res.send(surveytype);
             
              if(surveytype==="multiple"){
                res.redirect('/multiple/add');
                }

                
                surveyname=req.body.surveyname;
               
                res.redirect('/multiple/agreeadd');

    
});
/* Render Registration page */
router.get('/agreeadd', (req:express.Request, res: express.Response, next:any) => {
    
        Agree.find((error, agree) => {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // no error, we found a list of users
            res.render('multiple/agreeadd', {
                title: 'Agree Survey',
                surveyname:surveyname,
                agree: agree,
               messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : ''
            
            });
        }
    });
        
       
});

/* Process Registration Request */
router.post('/agreeadd', (req:express.Request, res: express.Response, next:any) => {
    // attempt to register user
    Agree.create({
        displayName: req.body.displayName,
        surveyName: req.body.surveyname,
        question: req.body.question,
        option1: 'Agree',
        option2: 'Disagree',
        
    }, function(error, User) {
        // did we get back an error or valid Article object?
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            res.redirect('/multiple/agreeadd');
        }
    })
});

// GET edit page - show the current user in the form
router.get('/agreeadd/:id', requireAuth, (req: express.Request, res: express.Response, next: any) => {
//res.send('fgfgfgf');
    var id = req.params.id;

    Agree.findById(id, (error, Agree) => {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            //show the edit view
            res.render('multiple/agreeedit', {
                title: 'User Details',
                agree: Agree,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});

// POST edit page - update the selected user
router.post('/agreeadd/:id', requireAuth, (req: express.Request, res: express.Response, next: any) => {

    // grab the id from the url parameter
    var id = req.params.id;

    // create and populate a user object
    var agree = new Agree({
        _id: id,
        displayName:req.body.displayName,
        surveyName: req.body.surveyname,
        question: req.body.question,
        option1: 'Agree',
         option2: 'Disagree'
          
    });
    
    

    // run the update using mongoose and our model
    Agree.update({ _id: id }, agree, (error) => {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // if update is successful redirect to the users page
            res.redirect('/multiple/agreeadd');
        }
    });
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

/* Process mutilpe  Request */
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

// GET edit page - show the current user in the form
router.get('/surveyname/', requireAuth, (req: express.Request, res: express.Response, next: any) => {
res.send('Error');
    /*var id = req.params.id;

   var ds=req.user.displayName ;
   Mcq.find(
   ,{displayName:ds},{surveyName:id},(error, mcq) => {
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


router.get('/agreedelete/:id', requireAuth, (req: express.Request, res: express.Response, next: any) => {

    // get the id from the url
    var id = req.params.id;

    // use the model and delete this record
    Agree.remove({ _id: id }, (error) => {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // if removal worked redirect to users page
            res.redirect('/multiple/agreeadd');
        }
    });
});
router.get('/text', requireAuth, (req: express.Request, res: express.Response, next: any) => {
      var ss=req.query;
      res.redirect('/multiple/respond/'+ss.displayName+'/'+ss.surveyType+'/'+ss.surveyName);

    //res.render('multiple/text');
});
router.post('/text', requireAuth, (req: express.Request, res: express.Response, next: any) => {
    var ss=req.body;
res.send(ss);
   // res.render('multiple/text');
});
router.get('/respond/:displayName/:surveyType/:surveyName', requireAuth, (req: express.Request, res: express.Response, next: any) => {
      var ss=req.query;
     res.send('whoooooooooooooooooooooooooooooo');

    //res.render('multiple/text');
});

// make this public
module.exports = router;