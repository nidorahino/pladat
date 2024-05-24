const express = require('express');
const router =  express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const passport = require('passport');

const User = require('../../models/User');
const Recruiter = require('../../models/Recruiter');
const Employer = require('../../models/Employer');
const Job = require('../../models/Job');

const { ensureIsEmployer, ensureAuthorisation, ensureAuthenticated }  =  require('../../configs/authorise');


router.get('/job/getSingleJob/:jobId', ensureAuthenticated, (req, res) => {
    Job.findOne({_id: req.params.jobId})
    .then(job => {
        if(!job) {
            return res.status(422).json({success: false, msg: "Job not found."});
        }
        res.status(200).json({success: true, msg: "Job found", job});
    })
    .catch(err => {
        res.status(422).json({success: false, msg: "Couldn't find job, something went wrong.", err});
    })
});

router.get('/job/getJobs/:skip', ensureAuthenticated, (req, res) => {
    Job.find()
    .sort({dateOpen: -1})
    .skip(Number(req.params.skip))
    .limit(21)
    .then(jobs => {
        if(!jobs || jobs.length  === 0) {
            return res.status(422).json({success: false, msg: "No jobs available"});
        }
        return res.status(200).json({success: false, msg: "Jobs found", jobs});
    })
    .catch(err => {
        return res.status(422).json({success: false, msg: "No jobs available", err});
    })
});

router.get('/job/getJobsByIndustry/:industry/:skip', ensureAuthenticated, (req, res) => {
    Job.find({industry: req.params.industry})
    .sort({dateOpen: -1})
    .skip(Number(req.params.skip))
    .limit(21)
    .then(jobs => {
        if(!jobs || jobs.length  === 0) {
            return res.status(422).json({success: false, msg: "No jobs available"});
        }
        return res.status(200).json({success: false, msg: "Jobs found", jobs});
    })
    .catch(err => {
        return res.status(422).json({success: false, msg: "No jobs available", err});
    })
})

router.get('/job/getJobsByEmployer/:empId/:skip', ensureAuthenticated, (req, res) => {
    Job.find({company: req.params.empId})
    .sort({dateOpen: -1})
    .skip(Number(req.params.skip))
    .limit(21)
    .then(jobs => {
        if(!jobs || jobs.length  === 0) {
            return res.status(422).json({success: false, msg: "No jobs available"});
        }
        return res.status(200).json({success: false, msg: "Jobs found", jobs});
    })
    .catch(err => {
        return res.status(422).json({success: false, msg: "No jobs available", err});
    })
})



module.exports = router;