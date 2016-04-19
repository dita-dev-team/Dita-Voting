var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//mongoose.connect('mongodb://root:root@ds025180.mlab.com:25180/dita_dev');
mongoose.connect('mongodb://localhost/dita_ballot_box');

var studentSchema = new Schema({
    fullname: {type: String, required: true},
    student_id: {type: String, required: true, unique: true},
    voting_no: {type: Number, required: true, unique: true},
    voted: {type: Boolean, required: true, default: false}
}, {collection: 'student'});
var Student = mongoose.model('Student', studentSchema);

var candidateSchema = new Schema({
    fullname: {type: String, required: true},
    student_id: {type: String, required: true, unique: true},
    position: {type: String, required: true},
    image: Buffer,
    votes: {type: Number, default: 0},
    created_at: {type: Date, default: Date.now}
}, {collection: 'candidate'});

candidateSchema.methods.isAcsStudent = function (callback) {
    console.log(this.student_id);
    this.model('Student').findOne({student_id: this.student_id}, function (err, student) {
        console.log(this.student_id);
        console.log(err);
        console.log(student);
        if (err != null || !student) {
            callback(false);
        }
        else
            callback(true);
    });
};

candidateSchema.methods.exists = function (callback) {
    this.findOne({student_id: this.student_id}, function (err, candidate) {
        if (err != null || !candidate)
            callback(false);
        else
            callback(true);
    });
};
var Candidate = mongoose.model('Candidate', candidateSchema);


module.exports.Candidate = Candidate;
module.exports.Student = Student;
