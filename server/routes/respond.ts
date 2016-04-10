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


router.get('/presend', requireAuth, (req: express.Request, res: express.Response, next: any) => {
      var ss=req.query;
      var sendgrid = require("sendgrid")("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");
var email = new sendgrid.Email();

email.addTo("patelritesh261@gmail.com");
email.setFrom("patelritesh261@gmail.com");
email.setSubject("Sending with SendGrid is Fun");
email.setHtml("/respond/"+ss.displayName+"/"+ss.surveyType+"/"+ss.surveyName);

sendgrid.send(email);
 res.send('whoooooooooooooooooooooooooooooo');
     // res.redirect('/respond/'+ss.displayName+'/'+ss.surveyType+'/'+ss.surveyName);

    //res.render('multiple/text');
});
router.post('/presend', requireAuth, (req: express.Request, res: express.Response, next: any) => {
    var ss=req.body;
res.send(ss);
   // res.render('multiple/text');
});
router.get('/:displayName/:surveyType/:surveyName', requireAuth, (req: express.Request, res: express.Response, next: any) => {
      var ss=req.query;
     res.send('whoooooooooooooooooooooooooooooo');

    //res.render('multiple/text');
});

// make this public
module.exports = router;