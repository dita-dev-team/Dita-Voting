var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://root:root@ds025180.mlab.com:25180/dita_dev');

var candidateSchema = new Schema({
    fullname: {type: String, required: true},
    studentId: {type: String, required: true, unique: true},
    position: {type: String, required: true},
    image: Buffer,
    votes: {type: Number, default: 0},
    created_at: {type: Date, default: Date.now}
});

var studentSchema = new Schema({
    fullname: {type: String, required: true},
    studentId: {type: String, required: true, unique: true},
    votingNo: {type: Number, required: true, unique: true},
    voted: {type: Boolean, required: true, default: false}
});

var Candidate = mongoose.model('Candidate', candidateSchema);
var Student = mongoose.model('Student', studentSchema);

candidateSchema.methods.isAcsStudent = function (callback) {
    Student.find({studentId: this.studentId}, function (err, student) {
        if (err == null || !student)
            callback(false);
        else
            callback(true);
    });
};

module.exports.Candidate = Candidate;
module.exports.Student = Student;
