var model = require('./model');

var student = new model.Student();
model.Student.find({}, function (err, students) {
    console.log(students);
});