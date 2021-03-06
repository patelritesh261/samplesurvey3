import express = require('express');
import passport = require('passport');
var router = express.Router();


//variable declaration
var surveyname,surveytype,mcqrespond,agreerespond,displayname,fromadds;
// db references
import mongoose = require('mongoose');
import mcqModel = require('../models/multiple');
import agreeModel = require('../models/agree');
import respondModel = require('../models/respond');

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


router.get('/presend', requireAuth, (req: express.Request, res: express.Response, next: any) => {
      var ss=req.query;
    var sendgrid = require("sendgrid")("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");
var email = new sendgrid.Email();
var domain="samplesurvey3.azurewebsites.net/respond";
email.addTo(ss.fromadd);
email.setFrom("patelritesh261@gmail.com");
email.setSubject("Plese give your important feedbak.");
email.setHtml("<html><body><main><h2>HI There,</main><h4>Please do following survey and give your feedback</h4><table><tr><td>Survey Name : </td><td>"+ss.surveyName+"</td></tr><tr><td>Created By : </td><td>"+ss.displayName+"</td></tr><tr><td>Link for feedback :  </td>http://samplesurvey3.azurewebsites.net/respond/"+ss.displayName+"/"+ss.surveyType+"/"+ss.surveyName+"/"+ss.fromadd+"<td></td></tr></table></body></html>");
//email.setHtml("/respond/"+ss.displayName+"/"+ss.surveyType+"/"+ss.surveyName);


sendgrid.send(email);
// res.send(ss);
      res.redirect('/users/');

    //res.render('multiple/text');
});
router.post('/presend', requireAuth, (req: express.Request, res: express.Response, next: any) => {
    var noq=req.body.length;
    
    var qanswer="";
   
for(var i=0;i<req.body.length;i++){
    if(i==0)
    {
        
        qanswer=req.body.answer0;
    }
    else if(i==1)
    {
        
        qanswer=req.body.answer1;
    }
    else if(i==2)
    {
        
        qanswer=req.body.answer2;
    }
    else if(i==3)
    {
        
        qanswer=req.body.answer3;
    }
    else if(i==4)
    {
        
        qanswer=req.body.answer4;
    }
    else if(i==5)
    {
        
        qanswer=req.body.answer5;
    }
    else if(i==6)
    {
        
        qanswer=req.body.answer6;
    }
    else if(i==7)
    {
        
        qanswer=req.body.answer7;
    }
    else if(i==8)
    {
        
        qanswer=req.body.answer8;
    }
    else if(i==9)
    {
        
        qanswer=req.body.answer9;
    }
    else if(i==10)
    {
        
        qanswer=req.body.answer10;
    }
   // res.send(qanswer);
 Respond.create({
        question: req.body.question[i],
       answer:qanswer,
        senderName: req.body.displayName,
        receiverName: req.body.fromadd,
        surveyName: req.body.surveyName,
    }, function(error, Respond) {
        // did we get back an error or valid Article object?
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
           
           // res.redirect('/multiple/add');
        }
    });
    qanswer="";
}
    res.redirect('/respond/thankyou');
});
router.get('/:displayName/:surveyType/:surveyName/:fromadd', (req: express.Request, res: express.Response, next: any) => {
    surveytype=req.params.surveyType;
      displayname=req.params.displayName;
       surveyname=req.params.surveyName;
       fromadds=req.params.fromadd;
     if(surveytype=="multiple"){
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
}else if(surveytype=="agree"){
    Agree.find({displayName:displayname,surveyName:surveyname},{},(error, agree) => {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // no error, we found a list of users
            agreerespond=agree;
            res.redirect('/respond/feedbackagree');
        }
    });
    
}
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
router.get('/feedbackagree', (req: express.Request, res: express.Response, next: any) => {
      res.render('respond/feedbackagree',{
          title:'Feedback',
          agree:agreerespond,
          surveyname:surveyname,
          displayName:displayname,
          fromadd:fromadds
      });
});
router.get('/presurveyreport', (req: express.Request, res: express.Response, next: any) => {
    
      res.render('respond/feedbackagree',{
          title:'Feedback',
          agree:agreerespond,
          surveyname:surveyname,
          displayName:displayname,
          fromadd:fromadds
      });
});
router.post('/presurveyreport', (req: express.Request, res: express.Response, next: any) => {
   var ss=req.body.surveyName;
                var ds=req.body.displayName;
                var rn=req.body.recieverName;
              
 Respond.find({senderName:ds,surveyName:ss,receiverName:rn},{},(error, respond) => {
                    if (error) {
                        console.log(error);
                        res.end(error);
                    }
                    else {
                            
                            // no error, we found a list of users
                                res.render('respond/surveyreport', {
                                title: 'Survey Report',
                                recieverName:rn,
                               surveyname:ss,
                                respond:respond,
                                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});
router.get('/thankyou', (req: express.Request, res: express.Response, next: any) => {
    
                               
     res.render('respond/thankyou',{
          title:'Thank you',
          displayName:displayname,
         
      });
});
// make this public
module.exports = router;
