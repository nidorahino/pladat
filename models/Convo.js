const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConvoSchema = new Schema({
    matchId: {type: String, required: true, ref: "Match"},
    recruiterId: {type: String, required: true, ref: "Recruiter"},
    studentId: {type: String, required: true, ref: "Student"},
    conversation: [{from: String, text: String, timestamp: String}]
});

module.exports = Convo = mongoose.model('Convo', ConvoSchema);