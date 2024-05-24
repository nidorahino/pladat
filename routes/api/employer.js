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
const Student = require('../../models/Student');


const { ensureAuthenticated, ensureAuthorisation } = require('../../configs/authorise');

const { JWT_EMAIL_VERIFY_SIGN_KEY_RECRUITER } = require('../../configs/prodConfig');
const MatchProfile = require('../../models/MatchProfile');
const Match = require('../../models/Match');


router.put('/completeBaiscProfile', ensureAuthorisation, (req, res) => {
    const { companyName, industry, location, shortDesc, yearFounded, companyGrowthStage, approxNumEmployees } = req.body;
    let newMatchProf = new MatchProfile({
        userId: req.user._id,
        psychType: req.user.typeOfUser,
        psychTarget: 'Student',
        candidates: [],
        companyName: companyName,
        industries: [...industry],
        locations: [location],
        cgs: companyGrowthStage,
        approxNumEmployees,
        compOffers: [],
        ir: req.user.internalRank,
        jobsListed: [],
        todos: [],
        workEnv: [],
        roles: [],

        universityPref: [],
        majorPref: [],
        skillsPref: [],
        experiencePref: [],
        personalityPref: []
    });
    newMatchProf.save()
    .then(empMatchProf => {
        Employer.findOneAndUpdate(
            {_id: req.user.id},
            {
                $set: {
                    companyName: companyName,
                    industry: industry,
                    location: location,
                    basicProfileInfoComplete: true,
                    shortDesc: shortDesc,
                    yearFounded: yearFounded,
                    approxNumEmployees: approxNumEmployees,
                    companyGrowthStage: companyGrowthStage,
                    isVerifiedCompany: true,
                    matchProfile: empMatchProf._id
                }
            },
            {
                new: true,
                returnNewDocument: true
            }
        )
        .then(employer => {
            return res.status(200).json({success: true, msg: "Completed employer basic profile.", employer, matchProf: empMatchProf});
        })
        .catch(err => {
            console.log(err);
            return res.status(422).json({success: false, msg: "Something went wrong; couldn't complete your employer basic profile.", err});
        })
    })
    .catch(err => {
        return res.status(422).json({success: false, msg: "Something went wrong; couldn't create match profile"}, err);
    })
    
});

router.put('/updateMatchProfile', ensureAuthorisation, (req, res) => {
   const {compOffer, studPersPref, workEnv} = req.user.values;
   MatchProfile.findOne({_id: req.user.matchProfile})
   .then(empMatchProf => {
       let curEmpProf = empMatchProf;
       curEmpProf.compOffers = [...compOffer];
       studPersPref.map((pref, idx) => {
            if(!curEmpProf.includes(pref)) {
                curEmpProf.push(pref);
            }
       });
       curEmpProf.workEnv = [...workEnv];
       MatchProfile.findOneAndUpdate(
           {_id: empMatchProf._id},
           {
               $set: {
                   ...curEmpProf
               }
           },
           {
               new: true,
               returnNewDocument: true
           }
       )
       .then(editedEmpMatchProf => {
           return res.status(200).json({success: false, msg: "Successfully edited match profile", matchProf: editedEmpMatchProf});
       })
       .catch(err => {
           return res.status(422).json({success: false, msg: 'Something went wrong; could not edit match profile', err});
       })
   })
   .catch(err => {
       return res.status(422).json({success: false, msg: "Something went wrong trying to edit match profile", err});
   })
});

router.put('/editProfile', ensureAuthorisation, (req, res) => {
    const {
        companyGrowthStage,
        approxNumEmployees,
        yearFounded,
        socials,
        industry,
        location,
        shortDesc, 
        values
    } = req.body;

    Employer.findOneAndUpdate(
        {_id: req.user._id},
        {
            $set: {
                companyGrowthStage: companyGrowthStage,
                approxNumEmployees: approxNumEmployees,
                yearFounded: yearFounded,
                socials: socials,
                industry: industry,
                location: location,
                shortDesc: shortDesc,
                values: values
            }
        },
        {
            returnNewDocument: true,
            new: true
        }
    )
    .then(employer => {
        res.status(200).json({success: true, msg: "Edited profile", employer});
    })
    .catch(err => {
        res.status(422).json({success: false, msg: "Something went wrong; couldn't edit profile", err});
    })
});

router.put('/verify-recruiter/:empId/:rToken', ensureAuthorisation, (req, res) => {
    if(!req.params.empId === req.user._id) {
        return res.status(403).json({success: false, msg: "You're not the employer this was meant for"})
    }

    jwt.verify(req.params.rToken, JWT_EMAIL_VERIFY_SIGN_KEY_RECRUITER, { }, (err, data) => {
        if(err) {
            return res.status(500).json({success: false, msg: "Something went wrong, couldn't verify recruiter.", err});
        }

        let rId = data.signUserInfo.uId;
        let recruiterInfo = data.signUserInfo;

        Recruiter.findOneAndUpdate(
            {_id: rId},
            {
                $set: {isCompanyVerified: true}
            },
            {
                new: true,
                returnNewDocument: true
            }
        )
        .then(recruiter => {
            if(recruiter && recruiter.companyId === req.user._id) {
                Employer.findOneAndUpdate(
                    {_id: req.user.id},
                    {
                        $push: {recruiters: recruiter._id}
                    },
                    {
                        new: true,
                        returnNewDocument: true
                    }
                )
                .then(employer => {
                    return res.status(200).json({success: true, msg: "We've verified your recruiter.", employer, recruiter: recruiterInfo});
                })
                .catch(err => {
                    return res.status(422).json({success: false, msg: "Couldn't add recruiter to list.", err});
                })
            }
            else {
                return res.status(403).json({success: false, msg: "This recruiter appears to no longer be registered on PlaceMint."});
            }
        })
        .catch(err => {
            return res.status(422).json({success: false, msg: "Something went wrong, couldn't verify recruiter", err});
        })
    })    
});

router.get('/getEmployer/:employerId', ensureAuthenticated, (req, res) => {
    Employer.findOne({_id: req.params.employerId})
    .then(employer => {
        if(!employer) {
            return res.status(422).json({success: false, msg: "Employer not found."});
        }
        employer.password = null;
        return res.status(200).json({success: true, msg: "Employer found.", employer});
    })
    .catch(err => {
        res.status(422).json({success: false, msg: "Something went wrong couldn't do employer search.", err});
    })
});

router.get('/getAllEmployers/:skip', ensureAuthenticated, (req, res) => {
    Employer.find()
    .sort({companyName: 1})
    .skip(Number(req.params.skip))
    .limit(21)
    .then(employers => {
        if(!employers || employers.length === 0) {
            return res.status(422).json({success: false, msg: Number(req.params.skip) > 21 ? "No employers left to load": "No employers registered", employers});
        }
        return res.status(200).json({success: true, msg: "Employers loaded", employers});
    })
    .catch(err => {
        return res.status(422).json({success: false, msg: "Something went wrong; couldn't load employers.", err});
    })
});

router.get('/getByIndustry/:industry/:skip', ensureAuthenticated, (req, res) => {
    Employer.find({industry: req.params.industry})
    .sort({companyName: 1})
    .skip(Number(req.params.skip))
    .limit(21)
    .then(employers => {
        if(!employers || employers.length === 0) {
            return res.status(422).json({success: false, msg: Number(req.params.skip) > 21 ? `No ${req.params.industry} employers left to load`: `No ${req.params.industry} employers registered`, employers});
        }
        return res.status(200).json({success: true, msg: `${req.params.industry} employers loaded`, employers});
    })
    .catch(err => {
        return res.status(422).json({success: false, msg: `Something went wrong; couldn't load ${req.params.industry} employers.`, err});
    })
});

router.get('/queryByName/:query', ensureAuthenticated, (req, res) => {
    Employer.find({companyName: { $regex: req.params.query, $options: 'i'} })
    .then(employers => {
        if(!employers) {
            return res.status(422).json({success: false, msg: "Employers not found."});
        }
        if(employers.length < 1) {
            Employer.find({_id: req.params.query})
            .then(employersById => {
                if(!employersById) {
                    return res.status(422).json({success: false, msg: "Employers not found."});
                }
                return res.status(200).json({success: true, msg: "Employer found by id.", employers: employersById})
            })
            .catch(err => {
                return res.status(422).json({success: false, msg: "Something went wrong; couldn't find employers.", err});
            })
        }
        else {
            return res.status(200).json({success: true, msg: employers.length > 0 ? "Search query done." : "No employers found", employers});
        }
    })
    .catch(err => {
        res.status(422).json({success: false, msg: "Something went wrong, couldn't query employers", err});
    })
});

router.post('/createJob', ensureAuthorisation, (req, res) => {
   const {
    title,
    description,
    locations,
    skillsRequired,
    typeOfJob,
    industry,
    assignedRecruiter,
    fullJobAppLink,
    dateClose, role,
    perks, workEnv, pay
   } = req.body;
   console.log(req.body);

   const newJobPost = new Job({
       title, description, companyName: req.user.companyName, locations, skillsRequired, typeOfJob, industry, dateClose,
       dateOpen: Date.now(), isOpen: true, matchProfile: req.user.matchProfile, role: role, perks: perks, workEnv: workEnv, pay: pay, compLogo: req.user.images[0],
       todo: 'not available', assignedRecruiter: 'not available', fullJobAppLink: 'not available', companyId: req.user.id
   });

   newJobPost.save()
   .then(job => {
        MatchProfile.findOneAndUpdate(
            {_id: req.user.matchProfile},
            {
                $addToSet: {
                    locations: {$each: locations},
                    industries: industry,
                    jobsListed: job._id,
                    skillsPref: {$each: skillsRequired},
                    // experiencePref: {$each: backgrounds},
                    compOffers: {$each: perks},
                    workEnv: {$each: workEnv},
                    // personalityPref: {$each: person},
                    roles: role
                }
            },
            {
                new: true,
                returnNewDocument: true
            }
        )
        .then(editedMp => {
            return res.status(200).json({success: true, msg: "created job, and edited match profile", job, matchProf: editedMp});
        })
        .catch(err => {
            console.log(err);
            return res.status(422).json({success: false, msg: "Someting went wrong; created job, but couldn't edit match profile.", err, job});
        }) 
   })
   .catch(err => {
       console.log(err);
       return res.status(422).json({success: false, msg: "Couldn't create job something went wrong", err});
   })
});

router.put('/editJob/:jobId', ensureAuthorisation, (req, res) => {
    const {
        title,
        description,
        location,
        todo,
        mustHaveSkills,
        recommendSkills,
        dateClose,
        matchLimit,
        typeOfJob,
        assignedRecruiters
    } = req.body;
    Job.findOneAndUpdate(
        {_id: req.params.jobId, company: req.user._id},
        {
            $set: {
                title: title,
                description: description,
                location: location,
                todo: todo,
                mustHaveSkills: mustHaveSkills,
                recommendSkills: recommendSkills,
                dateClose: dateClose,
                matchLimit: matchLimit,
                typeOfJob: typeOfJob,
                assignedRecruiters: assignedRecruiters
            }
        },
        {
            new: true,
            returnNewDocument: true
        }
    )
    .then(job => {
        if(!job) {
            return res.status(401).json({success: false, msg: "Must be the employer to edit job info."});
        }
        return res.status(200).json({success: true, msg: "Job info has been edited.", job});
    })
    .catch(err => {
        res.status(422).json({success: false, msg: "Something went wrong, couldn't edit job info.", err});
    })
});

router.put('/unlistJob/:jobId', ensureAuthorisation, (req, res) => {
    Job.findOneAndUpdate(
        {_id: req.params.jobId, company: req.user._id},
        {
            $set: { isOpen: false }
        },
        {
            new: true,
            returnNewDocument: true
        }
    )
    .then(job => {
        if(!job) {
            return res.status(422).json({success: false, msg: "Job doesn't exist, or you're not authorised."});
        }
        return res.status(200).json({success: true, msg: "Job has been unlisted.", job});
    })
    .catch(err => {
        res.status(422).json({success: false, msg: "Something went wrong, couldn't unlist job", err});
    })
});

router.put('/relistJob/:jobId', ensureAuthorisation, (req, res) => {
    Job.findOneAndUpdate(
        {_id: req.params.jobId, company: req.user._id},
        {
            $set: { isOpen: true }
        },
        {
            new: true,
            returnNewDocument: true
        }
    )
    .then(job => {
        if(!job) {
            return res.status(422).json({success: false, msg: "Job doesn't exist, or you're not authorised."});
        }
        return res.status(200).json({success: true, msg: "Job has been listed.", job});
    })
    .catch(err => {
        res.status(422).json({success: false, msg: "Something went wrong, couldn't list job", err});
    })
});

router.delete('/removeJob/:jobId', ensureAuthorisation, (req, res) => {
    Job.findOneAndDelete({_id: req.params.jobId, company: req.user._id})
    .then(job => {
        if(!job) {
            return res.status(401).json({success: false, msg: "Must be company admin to delete job"});
        }
        res.status(200).json({success: false, msg: "Job has been removed.", job});
    })
    .catch(err => {
        res.status(422).json({success: false, msg: "Something went wrong, couldn't remove job.", err});
    })
});

router.put('/assignRecruiter/:jobId/:recruiterId', ensureAuthorisation, (req, res) => {
   Recruiter.findOneAndUpdate(
       {_id: req.params.recruiterId, companyId: req.user._id},
       {
           $push: {jobsAssigned: req.params.jobId}
       },
       {
           new: true,
           returnNewDocument: true
       }
    )
   .then(recruiter => {
       if(!recruiter || !recruiter.companyId === req.user._id) {
            return res.status(401).json({success: false, msg: "Can only assign recruiters you employ."})
       }
       Job.findOneAndUpdate(
        {_id: req.params.jobId, company: req.user._id},
        {
            $set: { assignedRecruiter: req.params.recruiterId }
        },
        {
            new: true,
            returnNewDocument: true
        }
    )
    .then(job => {
        if(!job) {
            return res.status(401).json({success: false, msg: "Must be the employer to assign recruiters."});
        }
        return res.status(200).json({success: true, msg: "Recruiters have been assigend.", job});
    })
    .catch(err => {
        res.status(422).json({success: false, msg: "Something went wrong, couldn't assign recruiters to job.", err});
    })
   })
})

router.put('/swipeRight/:studentId', ensureAuthorisation, (req, res) => {
   MatchProfile.findOne({userId: req.params.studentId})
   .then(studentMatchProfile => {
        Job.find({
            companyId: req.user._id,
            swipedRightOnMe: {$in: [studentMatchProfile._id, req.params.studentId]} 
        })
        .then(jobs => {
            if(jobs && jobs.length > 0) {
                let matchIds = [];
                jobs.map((job, index) => {
                    let newMatch = new Match({
                        jobId: job._id,
                        employerId: req.user._id,
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
});

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
    Match.find({employerId: req.user._id})
    .then(matches => {
        if(matches.length === 0) {
            return res.status(200).json({success: true, msg: "No matches just yet; keep swiping.", matches});
        }
        matches.map((m, idx) => {
            let curM = {};
            Student.findOne({_id: m.studentId})
            .then(stud => {
                stud.password = null;
                curM['student'] = stud;
                Recruiter.findOne({_id: m.recruiterId})
                .then(emp => {
                    emp.password = null;
                    curM['recruiter'] = emp;
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