var bodyParser = require('body-parser');
var model = require('../model');
var express = require('express');
var router = express.Router();



router.get('/', function(req,res) {
    res.render('register', {title:'Register'});
});

router.post('/Candidate', function (req, res) {
    var fullName = req.body.registerFullName;
    var studentId = req.body.registerStudentID;
    var position = req.body.registerPosition;
    var image = req.body.registerImage;

    var candidate = new model.Candidate({
        fullname: fullName,
        studentId: studentId,
        position:  position,
        image: image
    })
    
    candidate.verify(function (result) {
        if(result){
                  candidate.save();      
        }
        else{
            
        }
    })

    console.log(" "+fullName+" "+studentId+" "+position+" "+image);
    app.use(bodyParser.urlencoded({extended: false}));
});

module.exports = router;