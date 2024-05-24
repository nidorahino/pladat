const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
    jobId: {type: String, required: true, ref: "Job"},
    employerId: {type: String, required: true, ref: "Employer"},
    studentId: {type: String, required: true, ref: "Student"},
    recruiterId: {type: String, required: true, ref: "Recruiter"},
    matchDate: {type: String, required: true, default: Date.now()},
    matchEnd: {type: String, required: true},
    convo: {type: String, required: false, ref: 'Convo', default: null}
});

module.exports = Match = mongoose.model('Match', MatchSchema);