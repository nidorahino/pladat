const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./User');

const Employer = User.discriminator('Employer', new Schema({
    companyName: {type: String, required: false, defualt: null},
    industry: [{type: String, required: false, defualt: null}],
    companyGrowthStage: {type: String, required: false, defualt: null},
    approxNumEmployees: {type: String, required: false, defualt: null},
    location: {type: String, required: false, defualt: null},
    yearFounded: {type: String, required: false, defualt: null},
    socials: {linkedin: String, twitter: String, insta: String, otherWeb: Schema.Types.Mixed},
    activeListed: [{type: Schema.Types.ObjectId, required: false, ref: 'Job', defualt: null}],
    recruiters: [{type: Schema.Types.ObjectId, required: false, ref: 'Recruiter', defualt: null}],
    internalRank: {type: Number, required: false, default: 1},
    matchProfile: {type: Schema.Types.ObjectId, required: false, ref: 'MatchProfile'},
    isVerifiedCompany: {type: Boolean, required: false, default: false},
    shortDesc: {type: String, required: false, default: null},
    values: {
        compOffer: [{type: String, lowercase: false, trim: true}],
        studPersPref: [{type: String, lowercase: false, trim: true}],
        workEnv: [{type: String, lowercase: false, trim: true}],
    }
}))

module.exports = mongoose.model('Employer');