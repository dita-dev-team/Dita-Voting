var bodyParser = require('body-parser');
var model = require('../model');
var express = require('express');
var router = express.Router();

var REGISTRATION_DATE = new Date(2016, 4, 25);



router.get('/', function(req,res) {
    var currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (+REGISTRATION_DATE == +currentDate) {
        res.render('register', {title: 'Register'});
    } else if (currentDate < REGISTRATION_DATE) {
        res.render('noregister', {message: 'Registration has not been opened'});
    } else if (currentDate > REGISTRATION_DATE) {
        res.render('noregister', {message: 'The registration deadline has passed.'});
    }
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
        if (result) {
            candidate.save();
        }
        else {
            res.redirect('back');
        }
    });

    console.log(" " + fullName + " " + studentId + " " + position + " " + image);
    app.use(bodyParser.urlencoded({extended: false}));
});

module.exports = router;