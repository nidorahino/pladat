const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const JobSchema = new Schema({
//    title: {type: String, required: true},
//    description: {type: String, required: true},
//    companyId: {type: String, required: true, ref: 'Employer'},
//    companyName: {type: String, required: true, default: null},
//    dateOpen: {type: String, default: new Date()},
//    locations: [{type: String, required: true}],
//    todo: {type: String, required: true},
//    skillsRequired: [{type: String, required: true}],
//    dateClose: {type: String, required: true},
//    matchProfile: {type: String, required: true, ref: 'MatchProfile'},
//    swipeRights: [{type: String, ref: 'Student'}],
//    matches: [{type: String, ref: 'Match'}],
//    numApplicants: {type: Number, default: 0, required: false},
//    typeOfJob: {type: String, default: null, required: true},
//    assignedRecruiter: {type: String, required: true, ref: 'Recruiter'},
//    fullJobAppLink: {type: String, required: true, default: null},
//    unListOnMatchLimit: {type: Boolean, required: true, default: false},
//    expTag: {type: String, required: true},
//    role: {type: String, required: true},
//    compOffer: [{type: String, trim: true}],
//    studPersPref: [{type: String, trim: true}],
//    workEnv: [{type: String, trim: true}],
//    companyGrowthStage: {type: String, required: false, defualt: null},
//    studMajors: [{type: String, required: true}],
//    industry: [{type: String, required: true}]
// });

const JobSchema = new Schema({
   //Public Info:
   title: {type: String, required: true},
   description: {type: String, required: true},
   companyName: {type: String, required: true},
   companyId: {type: String, required: true},
   locations: [{type: String, required: true}],
   todo: {type: String, required: true},
   skillsRequired: [{type: String, required: true}],
   typeOfJob: {type: String, required: true},
   industry: {type: String, required: true},
   role: {type: String, required: true},
   perks: [{type: String, required: true}],
   workEnv: [{type: String, required: true}],
   pay: {type: Schema.Types.Mixed, required: true},
   compLogo: {type: Schema.Types.Mixed, required: true},

   //Tracking:
   dateOpen: {type: String, required: false, default: new Date()},
   dateClose: {type: String, required: true},

   swipedRightOnMe: [{type: String, required: false, ref: 'Student'}],
   swipedLeftOnMe: [{type: String, required: false, ref: 'Student'}],

   numApplicants: {type: Number, required: false, default: 0},
   isOpen: {type: Boolean, required: true, default: false},

   //Logistics:
   assignedRecruiter: {type: String, required: false},
   fullJobAppLink: {type: String, required: true},

   //Analysis:
   matchProfile: {type: String, required: true, ref: 'Employer'},


})

module.exports = Job = mongoose.model('Job', JobSchema);