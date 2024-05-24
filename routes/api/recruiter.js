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
const MatchProfile = require('../../models/MatchProfile');
const Match = require('../../models/Match');

const { forwardAuthentication, ensureAuthenticated, ensureAuthorisation } = require('../../configs/authorise');

const { SENDGRID_APIKEY, CLIENT_ORIGIN, JWT_EMAIL_VERIFY_SIGN_KEY_RECRUITER, PROJECT_EMAIL, JWT_EMAIL_VERIFY_SIGN_OPTIONS} = require('../../configs/prodConfig');

const { recruiterConfigEmail } = require('../../configs/RecruiterVerification');
const Student = require('../../models/Student');


router.put('/completeBaiscProfile', ensureAuthorisation, (req, res) => {
    const { education, jobTitle, shortDesc, company } = req.body;

    if(!education || !jobTitle || !shortDesc || !company) {
        return res.status(401).json({success: false, msg: "Please enter all the required information."});
    }

    Employer.findOne({_id: company, isVerifiedCompany: true, isVerified: true, basicProfileInfoComplete: true})
    .then(employer => {
        if(!employer) {
            return res.status(403).json({success: false, msg: "You're employer must be registered on this platform."}); 
        }
        
        /* Send verificaiton email to employer, then write to db */

        let signUserInfo = { name: req.user.firstname + " " + req.user.lastname, email: req.user.email, uId: req.user._id};

        jwt.sign({signUserInfo}, JWT_EMAIL_VERIFY_SIGN_KEY_RECRUITER, JWT_EMAIL_VERIFY_SIGN_OPTIONS, (err, token) => {
            // console.log('Jwt started');
            if(err) {
                return res.status(500).json({success: false, msg: 'Something went wrong trying to verify you as a recruiter', err});
            }

            sgMail.setApiKey(SENDGRID_APIKEY);

            const returnLink = `${CLIENT_ORIGIN}/employer/verify-recruiter/${employer._id}/${token}`;

            const htmlContent = recruiterConfigEmail(employer.firstname, returnLink, employer.companyName, req.user.email, req.user.firstname + " " + req.user.lastname);

            const msg = {
                to: employer.email,
                from: PROJECT_EMAIL,
                subject: 'PlaceMint recruiter verification email for ' + employer.companyName,
                html: htmlContent
            };
            sgMail.send(msg, (err) => {
                // console.log('emailing recruiter company...');
                if(Object.entries(err).length > 0) {
                    return res.status(500).json({success: false, msg: "Something went wrong; can't send validation email.", err});
                }

                Recruiter.findOneAndUpdate(
                    {_id: req.user._id},
                    {
                        $set: {
                            education: education,
                            jobTitle: jobTitle,
                            company: employer.companyName,
                            shortDesc: shortDesc,
                            basicProfileInfoComplete: true,
                            companyId: employer._id
                        }
                    },
                    {
                        new: true,
                        returnNewDocument: true
                    }
                )
                .then(recruiter => {
                    return res.status(200).json({success: true, msg: "An email has been sent to your employer to verify you.", recruiter});
                })
                .catch(err => {
                    return res.status(500).json({success: false, msg: "Couldn't edit your basic profile", err});
                });
            });
            
        });

    })
    .catch(err => {
        res.status(422).json({success: false, msg: "Couldn't find your employer. Try again.", err});
    })
})

router.put('/updateMatchProfile', ensureAuthorisation, (req, res) => {
    const { automatedMatchMsg, matchProfile } = req.body;
    Recruiter.findOneAndUpdate(
        {_id: req.user._id},
        {
            $set: {
                automatedMatchMsg: automatedMatchMsg,
                matchProfile: matchProfile
            }
        },
        {
            new: true,
            returnNewDocument: true
        }
    )
    .then(recruiter => {
        return res.status(200).json({success: true, msg: "Edited match profile.", recruiter});
    })
    .catch(err => {
        res.status(422).json({success: false, msg: "Something went wrong; couldn't edit match profile.", err});
    })
    
});

router.put('/editProfile', ensureAuthorisation, (req, res) => {
    const {
        education,
        jobTitle,
        shortDesc,
        socials,
        automatedMatchMsg
    } = req.body;
    Recruiter.findOneAndUpdate(
        {_id: req.user._id},
        {
            $set: {
                education: education,
                jobTitle: jobTitle,
                shortDesc: shortDesc,
                socials: socials,
                automatedMatchMsg: automatedMatchMsg
            }
        },
        {
            new: true,
            returnNewDocument: true
        }
    )
    .then(recruiter => {
        res.status(200).json({success: true, msg: "Changed profile.", recruiter});
    })
    .catch(err => {
        res.status(422).json({success: false, msg: "Something went wrong; couldn't edit profile.", err});
    })
});

router.get('/getRecruiter/:rId', ensureAuthenticated, (req, res) => {
    Recruiter.findOne({_id: req.params.rId})
    .then(recruiter => {
        if(!recruiter) {
            return res.status(422).json({success: false, msg: "Recruiter doesn't exist"})
        }
        let returnedRecruiter = { ...recruiter, password: null };
        return res.status(200).json({success: true, msg: "Recruiter found.", recruiter: {...returnedRecruiter}})
    })
    .catch(err => {
        res.status(422).json({success: false, msg: "Something went wrong; couldn't find recruiter.", err});
    })
});

router.get('/getRecruiterOnJob/:jobId', ensureAuthenticated, (req, res) => {
    Job.findOne({_id: req.params.jobId})
    .then(job => {
        if(!job) {
            return res.status(422).json({success: false, msg: "Job doesn't exist"});
        }
        // const returnedRecruiter = { ...job.assignedRecruiter, password: null };
        return res.status(200).json({success: true, msg: "Recruiters for job found.", recruiter: job.assignedRecruiter});
    })
    .catch(err => {
        res.status(422).json({success: false, msg: "Something went wrong, couldn't get recruiters for this job", err});
    })
});

router.get('/getRecruitersForCompany/:empId', ensureAuthenticated, (req, res) => {
    Recruiter.find({companyId: req.params.empId})
    .then(recruiters => {
        if(!recruiters) {
            return res.status(422).json({success: false, msg: "recruiters not found for this company"});
        }
        return res.status(200).json({success: true, msg: "Recruiters found for company.", recruiters});
    })
    .catch(err => {
        res.status(422).json({success: false, msg: "Something went wrong; recruiters not found for this company", err});
    })
});


router.put('/swipeRight/:studentId', ensureAuthorisation, (req, res) => {
    MatchProfile.findOne({userId: req.params.studentId})
    .then(studentMatchProfile => {
         Job.find({
             companyId: req.user.companyId,
             swipedRightOnMe: {$in: [studentMatchProfile._id, req.params.studentId]} 
         })
         .then(jobs => {
             if(jobs && jobs.length > 0) {
                 let matchIds = [];
                 jobs.map((job, index) => {
                     let newMatch = new Match({
                         jobId: job._id,
                         employerId: req.user.companyId,
                         studentId: studentMatchProfile.userId,
                         recruiterId: job.assignedRecruiter,
                         matchDate: Date.now(),
                         matchEnd: job.dateClose
                     });
                     newMatch.save()
                     .then(sm => {
                         matchIds.push(sm._id);
                         if(matchIds.length === jobs.length) {
                             MatchProfile.findOneAndUpdate(
                                 {_id: studentMatchProfile._id},
                                 {
                                     $set: {ir: (studentMatchProfile.swipedRightOnMe.length+1)/(studentMatchProfile.swipedLeftOnMe.length)},
                                     $push: {matches: {$each: matchIds}}
                                 },
                                 {
                                     new: true,
                                     returnNewDocument: true
                                 }
                             )
                             .then(updatedStudentProf => {
                                 MatchProfile.findOneAndUpdate(
                                     {_id: req.user.matchProfile},
                                     {
                                         $addToSet: {
                                             universityPref: {$each: updatedStudentProf.university},
                                             majorPref: {$each: updatedStudentProf.majors},
                                             skillsPref: {$each: updatedStudentProf.skills},
                                             experiencePref: {$each: updatedStudentProf.experience},
                                             personalityPref: {$each: updatedStudentProf.personality}
                                         },
                                         $pop: {candidates: -1},
                                         $push: {matches: {$each: matchIds}}
                                     },
                                     {
                                         new: true,
                                         returnNewDocument: true
                                     }
                                 )
                                 .then(updatedEmployerProf => {
                                     return res.status(200).json({success: true, msg: "Swiped right on student, and edited profile.", isMatch: true, matchProf: updatedEmployerProf})
                                 })
                                 .catch(err => {
                                     return res.status(422).json({success: false, msg: "Something went wrong; swiped on student but couldn't update your match profile.", err});
                                 })
                             })
                             .catch(err => {
                                 return res.status(422).json({success: false, msg: "Something went wrong couldn't swipe on student", err});
                             })
                         }
                     })
                     .catch(err => {
                         return res.status(422).json({success: false, msg: "Something went wrong trying to create match.", err});
                     })
                 });
             }
             else {
                 // student hasn't swiped on any of company's jobs, so no match, but record swipe.
                 MatchProfile.findOneAndUpdate(
                     {_id: studentMatchProfile._id},
                     {
                         $push: {swipedRightOnMe: req.user.matchProfile},
                         $set: {ir: (studentMatchProfile.swipedRightOnMe.length+1)/(studentMatchProfile.swipedLeftOnMe.length)}
                     },
                     {
                         new: true,
                         returnNewDocument: true
                     }
                 )
                 .then(updatedStudentProf => {
                     MatchProfile.findOneAndUpdate(
                         {_id: req.user.matchProfile},
                         {
                             $addToSet: {
                                 universityPref: {$each: updatedStudentProf.university},
                                 majorPref: {$each: updatedStudentProf.majors},
                                 skillsPref: {$each: updatedStudentProf.skills},
                                 experiencePref: {$each: updatedStudentProf.experience},
                                 personalityPref: {$each: updatedStudentProf.personality}
                             },
                             $pop: {candidates: -1}
                         },
                         {
                             new: true,
                             returnNewDocument: true
                         }
                     )
                     .then(updatedEmployerProf => {
                         return res.status(200).json({success: true, msg: "Swiped right on student, and edited profile.", isMatch: false, matchProf: updatedEmployerProf})
                     })
                     .catch(err => {
                         return res.status(422).json({success: false, msg: "Something went wrong; swiped on student but couldn't update your match profile.", err});
                     })
                 })
                 .catch(err => {
                     return res.status(422).json({success: false, msg: "Something went wrong couldn't swipe on student", err});
                 })
 
             }
         })
         .catch(err => {
             return res.status(422).json({success: false, msg: "Something went wrong; couldn't swipe right on student "+req.params.studentId, err});
         })
    })
    .catch(err => {
        return res.status(422).json({success: false, msg: "Something went wrong; couldn't swipe right on student "+req.params.studentId, err});
    })
});

router.put('/swipeLeft/:studentId', ensureAuthorisation, (req, res) => {
    MatchProfile.findOne({userId: req.params.studentId})
        .then(studentMatchProf => {
            MatchProfile.findOneAndUpdate(
                {_id: studentMatchProf.id},
                {
                    $push: {swipedLeftOnMe: req.user.matchProfile},
                    $set: {ir: (studentMatchProf.swipedRightOnMe.length)/(studentMatchProf.swipedLeftOnMe.length+1)}
                },
                {
                    new: true, 
                    returnNewDocument: true
                }
            )
            .then(updatedStudentProf => {
                MatchProfile.findOneAndUpdate(
                    {_id: req.user.matchProfile},
                    {
                        $pop: {candidates: -1}
                    },
                    {
                        new: true,
                        returnNewDocument: true
                    }
                )
                .then(updatedEmployerProf => {
                    return res.status(200).json({success: true, msg: "Swiped left on student and updated match profile", matchProf: updatedEmployerProf})
                })
                .catch(err => {
                    return res.status(422).json({success: false, msg: "Something went wrong trying to swipe left on student.", err});
                })
            })
            .catch(err => {
                return res.status(422).json({success: false, msg: "Something went wrong trying to swipe left on student.", err});
            })
        })
        .catch(err => {
            return res.status(422).json({success: false, msg: "Something went wrong trying to swipe left on student.", err});
        })
})

router.put('/skipSwipe/:studentId', ensureAuthorisation, (req, res) => {
    Student.findOne({_id: req.params.studentId})
    .then(studentProf => {
        MatchProfile.findOneAndUpdate(
            {_id: req.user.matchProfile},
            {
                $pop: {candidates: -1},
                $push: {candidates: studentProf}
            }
        )
        .then(updatedEmpProf => {
            return res.status(200).json({success: true, msg: "Skipped student", matchProf: updatedEmpProf});
        })
        .catch(err => {
            return res.status(422).json({success: false, msg: "Something happened trying to skip swipe", err});
        })
    })
    .catch(err => {
        return res.status(422).json({success: false, msg: "Something happened trying to skip swipe", err});
    })
});

router.get('/getCandidates', ensureAuthenticated, (req, res) => {
    MatchProfile.findOne({_id: req.user.matchProfile})
    .then(empmp => {
        let cands = empmp.candidates;
        return res.status(200).json({success: true, msg: "Retrieved matching candidates.", candidates: cands})
    })
    .catch(err => {
        return res.status(422).json({success: false, msg: "Trouble getting candidates", err});
    })
});

router.get('/getMatches', ensureAuthorisation, (req, res) => {
    let matchObjArr = [];
    Match.find({recruiterId: req.user._id})
    .then(matches => {
        if(matches.length === 0) {
            return res.status(200).json({success: true, msg: "No matches just yet; keep swiping.", matches});
        }
        matches.map((m, idx) => {
            let curM = {};
            Student.findOne({_id: m.studentId})
            .then(stud => {
                stud.password=null;
                curM['student'] = stud;
                Employer.findOne({_id:m.employerId})
                .then(emp => {
                    emp.password = null;
                    curM['employer'] = emp;
                    curM['jobId'] = m.jobId;
                    curM['convoId'] = m.convo;
                    matchObjArr.push(curM);

                    if(matchObjArr.length === matches.length) {
                        return res.status(200).json({success: true, msg: "Loaded matches", matches: matchObjArr});
                    }
                })
                .catch(err => {
                    return res.status(422).json({success: false, msg: "Couldn't retrieve matches..", err});
                })
            })
            .catch(err => {
                return res.status(422).json({success: false, msg: "Couldn't retrieve matches..", err});
            })
            
        });
    })
    .catch(err => {
        return res.status(422).json({success: false, msg: "something went wrong; couldn't retrieve matches", err});
    })
});

module.exports = router;