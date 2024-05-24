const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MatchProfileSchema =  new Schema({
    userId: {type: String, required: true, ref: "User"},
    psychType: {type: String, required: true},
    psychTarget: {type: String, required: true},
    candidates: [{type: Schema.Types.ObjectId, required: false}],
    matches: [{type: Schema.Types.ObjectId, required: false, ref: 'Match'}],
    swipedRightOnMe: [{type: Schema.Types.ObjectId, required: false}],
    swipedLeftOnMe: [{type: Schema.Types.ObjectId, required: false}],

}, {strict: false});

module.exports = MatchProfile = mongoose.model('MatchProfile', MatchProfileSchema);