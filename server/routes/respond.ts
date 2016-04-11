import express = require('express');
import passport = require('passport');
var router = express.Router();


//variable declaration
var surveyname,surveytype,mcqrespond,displayname,fromadds;
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


router.get('/presend', requireAuth, (req: express.Request, res: express.Response, next: any) => {
      var ss=req.query;
    /*  var sendgrid = require("sendgrid")("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");
var email = new sendgrid.Email();

email.addTo("patelritesh261@gmail.com");
email.setFrom("patelritesh261@gmail.com");
email.setSubject("Sending with SendGrid is Fun");
email.setHtml("<html><body><main><h2>HI There,</main><h4>Please do following survey and give your feedback</h4><table><tr><td>Survey Name : </td><td>"+ss.surveyName+"</td></tr><tr><td>Created By : </td><td>"+ss.displayName+"</td></tr><tr><td colspan=2><a href="+"/respond/"+ss.displayName+"/"+ss.surveyType+"/"+ss.surveyName+" >Give feedback</a></td></tr></table></body></html>");
//email.setHtml("/respond/"+ss.displayName+"/"+ss.surveyType+"/"+ss.surveyName);


sendgrid.send(email);*/
// res.send(ss);
      res.redirect('/respond/'+ss.displayName+'/'+ss.surveyType+'/'+ss.surveyName+'/'+ss.fromadd);

    //res.render('multiple/text');
});
router.post('/presend', requireAuth, (req: express.Request, res: express.Response, next: any) => {
    var ss=req.body;
res.send(ss);
   // res.render('multiple/text');
});
router.get('/:displayName/:surveyType/:surveyName/:fromadd', (req: express.Request, res: express.Response, next: any) => {
      displayname=req.params.displayName;
       surveyname=req.params.surveyName;
       fromadds=req.params.fromadd;
     
    // use the Users model to query the Users collection 
   Mcq.find({displayName:displayname,surveyName:surveyname},{},(error, mcq) => {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // no error, we found a list of users
            mcqrespond=mcq;
            res.redirect('/respond/feedbackmcq');
        }
    });

    //res.render('multiple/text');
});

router.get('/feedbackmcq', (req: express.Request, res: express.Response, next: any) => {
      res.render('respond/feedbackmcq',{
          title:'Feedback',
          mcq:mcqrespond,
          surveyname:surveyname,
          displayName:displayname,
          fromadd:fromadds
      });
});


// make this public
module.exports = router;