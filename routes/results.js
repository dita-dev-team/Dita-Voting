var model = require('../model');
var express = require('express');
var router = express.Router();

router.get('/', function(req,res) {
    model.Candidate.find({}, function (err, results) {
        if (!err && results) {
            res.render('results', {title: 'Results', votes: results});
        }
    })
});

module.exports = router;