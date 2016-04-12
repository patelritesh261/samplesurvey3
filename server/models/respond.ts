import mongoose = require('mongoose');
import passportLocalMongoose = require('passport-local-mongoose');

// DEFINE THE OBJECT SCHEMA
var respondSchema = new mongoose.Schema({
    
    question: {
        type: String,
        default: '',
        trim: true,
        required: 'question is required'
    },
    answer: {
        type: String,
        default: '',
        trim: true,
        required: 'Option 1 is required'
    },
    
    senderName: {
        type: String,
        default: '',
        trim: true,
        required: 'Sender Name is required'
    },
    receiverName: {
        type: String,
        default: '',
        trim: true,
        required: 'Receiver Name is required'
    },
    surveyName: {
        type: String,
        default: '',
        trim: true,
        required: 'Survey Name is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
},
    { collection: 'respondInfo' });

//var options = ({missingPasswordError: "Wrong password"});
//mcqSchema.plugin(passportLocalMongoose, options);

// MAKE THIS PUBLIC SO THE CONTROLLER CAN SEE IT
export var Respond = mongoose.model('Respond', respondSchema);