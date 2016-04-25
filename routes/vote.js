var bodyParser = require('body-parser');
var model = require('../model');
var express = require('express');
var router = express.Router();

var VOTING_DATES = [
    new Date(2016, 3, 28),
    new Date(2016, 3, 29)
];

var storeVote = function (studentId, callback) {
    model.Candidate.findOne({fullname: studentId}, function (err, candidate) {
        if (err == null && candidate) {
            candidate.votes = candidate.votes + 1;
            candidate.save();
            callback(true);
        } else {
            callback(false);
        }
    });
};

router.get('/', function(req,res) {
    var currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (currentDate < VOTING_DATES[0]) {
        res.render('closed', {message: 'Voting has not been opened'});
    } else if (currentDate > VOTING_DATES[1]) {
        res.render('closed', {message: 'The voting deadline has passed.'});
    } else {
        model.Candidate.find({}, function (err, candidates) {
            if (!err && candidates) {
                res.render('vote', {title: 'Vote', candidates: candidates});
            }
        });
    }
    

});

router.post('/', function(req,res) {
    var votingNo = req.body.votingNumber;

    model.Student.findOne({voting_no: votingNo}, function (err, student) {
        if (err != null || !student) {
            model.Candidate.find({}, function (err, candidates) {
                if (!err && candidates) {
                    res.render('vote', {
                        error: true,
                        message: 'Please enter a valid voting number',
                        candidates: candidates
                    });
                }
            });
        } else {
            if (student.voted) {
                model.Candidate.find({}, function (err, candidates) {
                    if (!err && candidates) {
                        res.render('vote', {
                            error: true,
                            message: 'This voting number has already been used',
                            candidates: candidates
                        });
                    }
                });
            } else {
                var candidates = new Array(
                    req.body.chairperson,
                    req.body.vicechair,
                    req.body.secretary,
                    req.body.publicRelations,
                    req.body.organizingSecretary,
                    req.body.treasurer,
                    req.body.resourceManager
                );

                candidates.forEach(function (candidate) {
                    storeVote(candidate, function (err) {
                    });
                });

                student.voted = true;
                student.save();
                res.render('thanks');

            }
        }
    })
});

module.exports = router;