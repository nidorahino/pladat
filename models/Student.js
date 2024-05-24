const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./User');

const Student = User.discriminator('Student', new Schema({
    university: [{type: String, required: false, defualt: null}],
    major: [{type: String, required: false, defualt: null}],
    graduationDate: {type: String, required: false, defualt: null},
    shortDesc: {type: String, required: false, defualt: null},
    skills: [{type: String, required: false, defualt: null}],
    socials: {linkedin: String, personalSite: String, otherWeb: Schema.Types.Mixed},
    resume: {type: String, required: false, defualt: null},
    values: {
        compVals: [{type: String, lowercase: false, trim: true}],
        personality: [{type: String, lowercase: false, trim: true}],
        workEnv: [{type: String, lowercase: false, trim: true}],
        compStage: [{type: String, lowercase: false, trim: true}],
        industry: [{type: String, lowercase: false, trim: true}]
    },
    internalRank: {type: Number, required: false, default: 1},
    
    matchProfile: {type: Schema.Types.ObjectId, required: false, ref: 'MatchProfile'},
    preferredRoles: [{type: String, required: false, default: null}],
    generalExperience: [{type: String, required: false, defualt: null}],
}))

module.exports = mongoose.model('Student');