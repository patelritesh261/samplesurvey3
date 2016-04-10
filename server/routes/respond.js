"use strict";
var express = require('express');
var router = express.Router();
//variable declaration
var surveyname, surveytype;
/* Utility Function to check if user is authenticated */
function requireAuth(req, res, next) {
    // check if the user is logged in
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}
router.get('/presend', requireAuth, function (req, res, next) {
    var ss = req.query;
    var sendgrid = require("sendgrid")("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");
    var email = new sendgrid.Email();
    email.addTo("patelritesh261@gmail.com");
    email.setFrom("patelritesh261@gmail.com");
    email.setSubject("Sending with SendGrid is Fun");
    email.setHtml("/respond/" + ss.displayName + "/" + ss.surveyType + "/" + ss.surveyName);
    sendgrid.send(email);
    res.send('whoooooooooooooooooooooooooooooo');
    // res.redirect('/respond/'+ss.displayName+'/'+ss.surveyType+'/'+ss.surveyName);
    //res.render('multiple/text');
});
router.post('/presend', requireAuth, function (req, res, next) {
    var ss = req.body;
    res.send(ss);
    // res.render('multiple/text');
});
router.get('/:displayName/:surveyType/:surveyName', requireAuth, function (req, res, next) {
    var ss = req.query;
    res.send('whoooooooooooooooooooooooooooooo');
    //res.render('multiple/text');
});
// make this public
module.exports = router;

//# sourceMappingURL=respond.js.map
