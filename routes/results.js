var model = require('../model');
var express = require('express');
var router = express.Router();

var RESULTS_DATE = new Date(2016, 4, 30);

router.get('/', function(req,res) {
    var currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (currentDate < RESULTS_DATE) {
        res.render('closed', {message: 'Results will be availabe on 30 April 2016'});
    } else {
        model.Candidate.find({}, function (err, results) {
            if (!err && results) {
                res.render('results', {title: 'Results', votes: results});
            }
        })
    }
});

module.exports = router;