var mongoose = require('mongoose');
mongoose.set('debug', true);
var Schema = mongoose.Schema;

//mongoose.connect('mongodb://root:root@ds025180.mlab.com:25180/dita_dev');
mongoose.connect('mongodb://localhost/dita_ballot_box');

var studentSchema = new Schema({
    fullname: {type: String, required: true},
    student_id: {type: String, required: true, unique: true},
    votingNo: {type: Number, required: true, unique: true},
    voted: {type: Boolean, required: true, default: false}
});
var Student = mongoose.model('Student', studentSchema, 'student');

var candidateSchema = new Schema({
    fullname: {type: String, required: true},
    student_id: {type: String, required: true, unique: true},
    position: {type: String, required: true},
    image: Buffer,
    votes: {type: Number, default: 0},
    created_at: {type: Date, default: Date.now}
});

candidateSchema.methods.isAcsStudent = function (callback) {
    Student.findOne({student_id: this.student_id}, function (err, student) {
        if (err != null || !student) {
            callback(false);
        }
        else
            callback(true);
    });
};

var Candidate = mongoose.model('Candidate', candidateSchema, 'candidate');


module.exports.Candidate = Candidate;
module.exports.Student = Student;
