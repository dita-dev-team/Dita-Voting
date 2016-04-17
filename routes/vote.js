var express = require('express');
var router = express.Router();

router.get('/', function(req,res) {
    res.render('vote', {title:'Vote'});
});

router.post('/', function(req,res) {
    req.Validator.validate('votingNumber', {
            required: true
        })
        .filter('votingNumber', {
            trim: true
        });
});

module.exports = router;