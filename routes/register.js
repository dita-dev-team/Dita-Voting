var bodyParser = require('body-parser');
var model = require('../model');
var express = require('express');
var router = express.Router();

var REGISTRATION_DATES = [
    new Date(2016, 4, 20),
    new Date(2016, 4, 21),
    new Date(2016, 4, 22),
    new Date(2016, 4, 23),
    new Date(2016, 4, 24)
];

var verifyYear = function(year, callback) {
    var yearOfAdmission = 20 + year.substring(0, 2);
    if (new Date().getFullYear() - parseInt(yearOfAdmission) < 2) {
        callback(false);
    } else {
        callback(true);
    }
};

router.get('/', function(req,res) {
    /*var currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (currentDate < REGISTRATION_DATES[0]) {
        res.render('noregister', {message: 'Registration has not been opened'});
    } else if (currentDate > REGISTRATION_DATES[4]) {
        res.render('noregister', {message: 'The registration deadline has passed.'});
    } else {
        res.render('register', {title: 'Register'});
    }*/
    res.render('register', {title: 'Register'});
});

router.post('/', function (req, res) {
    var fullName = req.body.registerFullName;
    var studentId = req.body.registerStudentID;
    var position = req.body.registerPosition;
    var image = req.body.registerImage;

    var candidate = new model.Candidate({
        fullname: fullName,
        studentId: studentId,
        position: position,
        image: image
    });

    candidate.verify(function (result) {
        if (!result) {
            res.render('register', {error: true, message: 'Must be an ACS student'});
        } else {
            verifyYear(studentId, function(result) {
                if (!result) {
                    res.render('register', {error: true, message: 'Must be a third or fourth year'});
                } else {
                    candidate.save();
                }
            });
        }
    });

    //console.log(" " + fullName + " " + studentId + " " + position + " " + image);
    //app.use(bodyParser.urlencoded({extended: false}));
});

module.exports = router;