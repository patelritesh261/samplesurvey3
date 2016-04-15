import express = require('express');
import passport = require('passport');
var router = express.Router();
//variable declaration
var ss;
// db references
import mongoose = require('mongoose');
import userModel = require('../models/user');
import mcqModel = require('../models/multiple');
import agreeModel = require('../models/agree');
import respondModel = require('../models/respond');
import User = userModel.User;
import Mcq = mcqModel.Mcq;
import Agree = agreeModel.Agree;
import Respond = respondModel.Respond;

/* Utility Function to check if user is authenticated */
function requireAuth(req:express.Request, res:express.Response, next: any) {
    // check if the user is logged in
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}

// GET - show main users page - list all the users
router.get('/', requireAuth, (req: express.Request, res: express.Response, next: any) => {
   
    // use the Users model to query the Users collection
    User.find((error, users) => {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            
                var ds=req.user.displayName ;
                Mcq.distinct("surveyName",{displayName:ds},(error, mcq) => {
                    if (error) {
                        console.log(error);
                        res.end(error);
                    }
                    else {
                        
                         Agree.distinct("surveyName",{displayName:ds},(error, agree) => {
                    if (error) {
                        console.log(error);
                        res.end(error);
                    }
                    else {
                              
                             Respond.distinct("surveyName",{senderName:ds},(error, respond) => {
                    if (error) {
                        console.log(error);
                        res.end(error);
                    }
                    else {
                              
                            // no error, we found a list of users
                                res.render('users/index', {
                                title: 'Users',
                                users: users,
                                mcq:mcq,
                                agree: agree,
                                respond:respond,
                                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
        }
    });
                    }                  
            });
        }
    });
});        
  
  
// GET - show main users page - list all the users
router.get('/respondselectsurvey', requireAuth, (req: express.Request, res: express.Response, next: any) => {

    // use the Users model to query the Users collection
    Respond.find((error, respond) => {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // no error, we found a list of users
            
            res.render('users/', {
                title: 'MCQ Survey',
                respond: respond,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});
router.post('/respondselectsurvey', requireAuth, (req: express.Request, res: express.Response, next: any) => {
   
    
            // no error, we found a list of users
          
                
                ss=req.body.surveyName;
                var ds=req.body.displayName;
       Respond.distinct("receiverName",{senderName:ds,surveyName:ss},(error, respond) => {
                    if (error) {
                        console.log(error);
                        res.end(error);
                    }
                    else {
                              
                            // no error, we found a list of users
                                res.render('users/respondselectsurvey', {
                                title: 'Responses',
                                
                               surveyname:ss,
                                respond:respond,
                                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
    
              
       
    
});  
        
    

// GET - show main users page - list all the users
router.get('/selectsurvey', requireAuth, (req: express.Request, res: express.Response, next: any) => {
   
    // use the Users model to query the Users collection
    Mcq.find((error, mcq) => {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // no error, we found a list of users
            
            res.render('users/', {
                title: 'MCQ Survey',
                mcq: mcq,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});
router.post('/selectsurvey', requireAuth, (req: express.Request, res: express.Response, next: any) => {
   
    
            // no error, we found a list of users
          
                
                ss=req.body.surveyName;
       // return  res.redirect('/users/surveylist');
        Mcq.find((error, mcq) => {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // no error, we found a list of users
           
           res.render('users/surveylist', {
                title: 'MCQ Survey',
                surveyname:ss,
                mcq: mcq,
            displayName: req.user ? req.user.displayName : '',
            
            });
        }
    });
              
       
    
});

// GET - show main users page - list all the users
router.get('/selectsurveyagree', requireAuth, (req: express.Request, res: express.Response, next: any) => {
   
    // use the Users model to query the Users collection
    Agree.find((error, agree) => {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // no error, we found a list of users
            
            res.render('users/agreesurveylist', {
                title: 'Agree/Disagree Survey',
                agree: agree,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});
router.post('/selectsurveyagree', requireAuth, (req: express.Request, res: express.Response, next: any) => {
   
    
            // no error, we found a list of users
          
                 // res.redirect('/surveylist');
                ss=req.body.surveyName;
         
          Agree.find((error, agree) => {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // no error, we found a list of users
            res.render('users/agreesurveylist', {
                title: 'Agree/Disagree Survey',
                surveyname:ss,
                agree: agree,
            displayName: req.user ? req.user.displayName : ''
            
            });
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
router.get('/:id', requireAuth, (req: express.Request, res: express.Response, next: any) => {

    var id = req.params.id;

    User.findById(id, (error, User) => {
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
router.post('/:id', requireAuth, (req: express.Request, res: express.Response, next: any) => {

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
    User.update({ _id: id }, user, (error) => {
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
router.get('/delete/:id', requireAuth, (req: express.Request, res: express.Response, next: any) => {

    // get the id from the url
    var id = req.params.id;

    // use the model and delete this record
    User.remove({ _id: id }, (error) => {
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

// GET edit page - show the current user in the form
/* Render Registration page */
router.get('/surveylist1',requireAuth, (req:express.Request, res: express.Response, next:any) => {

      Mcq.find((error, mcq) => {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // no error, we found a list of users
            res.render('users/surveylist', {
                title: 'MCQ Survey',
                surveyname:ss,
                mcq: mcq,
            displayName: req.user ? req.user.displayName : ''
            
            });
        }
    });
       
});
router.get('/selectsurvey/send',requireAuth, (req:express.Request, res: express.Response, next:any) => {
    res.redirect('/login');
});


// make this public
module.exports = router;