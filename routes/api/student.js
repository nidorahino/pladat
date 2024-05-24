const express = require('express');
const router =  express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const passport = require('passport');

const User = require('../../models/User');
const Student = require('../../models/Student');
const Job = require('../../models/Job');
const MatchProfile = require('../../models/MatchProfile');
const Match = require('../../models/Match');

const { forwardAuthentication, ensureAuthenticated, ensureAuthorisation } = require('../../configs/authorise');
const Employer = require('../../models/Employer');
const Recruiter = require('../../models/Recruiter');



router.put('/completeBasicProfile', ensureAuthorisation, (req, res) => {
    const {
        university,
        major,
        graduationDate,
        shortDesc,
        preferredRoles,
        generalExperience,
        skills
    } = req.body;

    if(!university || !major || !graduationDate || !shortDesc || !preferredRoles || !generalExperience || !skills) {
        return res.status(401).json({success: false, msg: "Please enter all data."});
    }
    let studMatchProfile = new MatchProfile({
        userId: req.user._id,
        psychType: req.user.typeOfUser,
        psychTarget: 'Employer',
        candidates: [],
        university: university,
        majors: major,
        skills: skills,
        experience: [...generalExperience],
        roles: [...preferredRoles],
        
        ir: req.user.internalRank,
        personality: [],
        locations: [],
        jobTypes: [],
        companies: [],
        cgs: [],
        industries: [],
        workEnv: [],
        compOffers: [],
        todos: [],
        pay: []
    });
    studMatchProfile.save()
    .then(matchProf => {
       if(!matchProf) {
           return res.status(422).json({success: false, msg: "Couldn't edit basic profile"});
       }
       Student.findOneAndUpdate(
           {_id: req.user._id},
           {
               $set: {
                   matchProfile: matchProf._id,
                   university: university,
                   major: major,
                   skills: skills,
                   shortDesc: shortDesc,
                   graduationDate: graduationDate,
                   preferredRoles: preferredRoles,
                   generalExperience: generalExperience,
                   basicProfileInfoComplete: true
               }
           },
           {
               new: true,
               returnNewDocument: true
           }
       )
       .then(student => {
            return res.status(200).json({success: true, msg: "Created match profile, and edited basic", student: student, matchProf});
       })
       .catch(err => {
           return res.status(422).json({success: false, msg: "Created match profile, but couldn't edit basic.", err});
       })
    })
    .catch(err => {
        return res.status(422).json({success: false, msg: 'Edited basic info, but failed to make match profile.', err});
    });
});


router.put('/updateMatchProfile', ensureAuthorisation, (req, res) => {
    Student.findOne({_id: req.user._id})
    .then(student => {
        const { values } = student.values;

        let offers = [...values.compVals];
        let workEnv = [...values.workEnv];
        let stage = [...values.compStage];
        let inds = [...values.industry];
        let pers = values.personality;
    
        MatchProfile.findOneAndUpdate(
            {_id: student.matchProfile},
            {
                $set: {
                    personality: pers,
                    cgs: stage,
                    industries: inds,
                    workEnv: workEnv,
                    compOffers: offers,
                }
            },
            {
                new: true,
                returnNewDocument: true
            }
        )
        .then(mp => {
            return res.status(200).json({success: true, msg: 'updated match profile', mp});
        })
        .catch(err => {
            return res.status(422).json({success: false, msg: "couldn't update match profile", err});
        })
    })
    .catch(err => {
        res.status(422).json({success: true, msg: "Something went wrong couldn't update match profile", err});
    })
});


router.put('/editProfile', ensureAuthorisation, (req, res) => {
    const {
        university,
        major,
        graduationDate,
        shortDesc,
        skills,
        resume,
        values,
        preferredRoles,
        generalExperience,
        socials
    } = req.body;

    Student.findOneAndUpdate(
        {_id: req.user.id},
        {
            $set: {
                university,
                major,
                graduationDate,
                shortDesc,
                skills,
                resume,
                values,
                socials,
                generalExperience,
                preferredRoles
            }
        },
        {
            returnNewDocument: true,
            new: true
        }
    )
    .then(student => {
        if(student) {
            return res.status(200).json({success: true, msg: 'Some edits have been made to your profile.', student});
        }
        else {
            return res.status(422).json({success: false, msg: 'Something went wrong editing your profile'});
        }
    })
    .catch(err => {
        res.status(422).json({success: false, msg: 'Something went wrong tyring to edit your profile; try again.', err});
    })
});

router.get('/getStudent/:sId', ensureAuthenticated, (req, res) => {
    Student.findOne({_id: req.params.sId})
    .then(student => {
        if(!student) {
            return res.status(422).json({success: false, msg: "Student not found"})
        }
        const returnedStudent = { ...student, password: null};
        return res.status(200).json({success: true, msg: "Student found", student: {...returnedStudent}});
    })
    .catch(err => {
        res.status(422).json({success: false, msg: "Something went wrong; couldn't find student.", err});
    })
})

router.put('/swipeRight/:jobId', ensureAuthorisation, (req, res) => {
    Job.findOneAndUpdate(
        {_id: req.params.jobId},
        {
            $push: { swipedRightOnMe:req.user.matchProfile },
            $inc: { numApplicants: 1 }
        },
        {
            new: true,
            returnNewDocument: true
        }
    )
    .then(swipedJob => {
        MatchProfile.findOne({_id: swipedJob.matchProfile})
        .then(empMatchProf => {
            MatchProfile.findOne({_id: req.user.matchProfile})
            .then(studMatchProf => {
                const isMatch = swipedJob.swipedRightOnMe.includes(req.user.matchProfile) && studMatchProf.swipedRightOnMe.includes(empMatchProf._id);
                if(isMatch) {
                    let newMatch = new Match({
                        jobId: swipedJob._id,
                        employerId: swipedJob.companyId,
                        studentId: req.user._id,
                        recruiterId: swipedJob.assignedRecruiter,
                        matchDate: Date.now(),
                        matchEnd: swipedJob.dateClose
                    });
                    newMatch.save()
                    .then(newMatch => {
                        MatchProfile.findOneAndUpdate(
                            {_id: empMatchProf._id},
                            {
                                $push: {matches: newMatch._id},
                                $set: {ir: (empMatchProf.swipedRightOnMe.length+1)/empMatchProf.swipedLeftOnMe.length}
                            }
                        )
                        .then(updatedEmpMatchProf => {
                            MatchProfile.findOneAndUpdate(
                                {_id: req.user.matchProfile},
                                {
                                    $addToSet: {
                                        companies: empMatchProf.userId,
                                        industries: {$each: empMatchProf.industries},
                                        compOffers: {$each: empMatchProf.compOffers},
                                        workEnv: {$each: empMatchProf.workEnv},
                                        cgs: empMatchProf.cgs,
                                        jobTypes: swipedJob.typeOfJob,
                                        roles: swipedJob.role,
                                        pay: swipedJob.pay
                                    },
                                    $push: {matches: newMatch._id},
                                    $pop: {candidates: -1}
                                },
                                {
                                    new: true,
                                    returnNewDocument: true
                                }
                            )
                            .then(finalSM => {
                                return res.status(200).json({success: true, msg: "Swiped right on job, and updated match profile", matchProf: finalSM, isMatch: true});
                            })
                            .catch(err => {
                                return res.status(422).json({success: false, msg: "Something went wrong trying to update you match profile"}, err);
                            })
                        })
                        .catch(err => {
                            return res.status(422).json({success: false, msg: "Something went wrong trying to update employer match profile", err});
                        })
                    })
                    .catch(err => {
                        return res.status(422).json({success: false, msg: 'Something went wrong creating match', err});
                    })
                }
                else {
                    MatchProfile.findOneAndUpdate(
                        {_id: empMatchProf._id},
                        {
                            $push: {swipedRightOnMe: studMatchProf._id},
                            $set: {ir: (empMatchProf.swipedRightOnMe.length+1)/empMatchProf.length.swipedLeftOnMe}
                        }
                    )
                    .then(empMatchProf => {
                        MatchProfile.findOneAndUpdate(
                            {_id: req.user.matchProfile},
                            {
                                $addToSet: {
                                    companies: empMatchProf.userId,
                                    industries: {$each: empMatchProf.industries},
                                    compOffers: {$each: empMatchProf.compOffers},
                                    workEnv: {$each: empMatchProf.workEnv},
                                    cgs: empMatchProf.cgs,
                                    jobTypes: swipedJob.typeOfJob,
                                    roles: swipedJob.role
                                },
                                $pop: {candidates: -1}
                            },
                            {
                                new: true,
                                returnNewDocument: true
                            }
                        )
                        .then(finalSM => {
                            return res.status(200).json({success: true, msg: "Swiped right on job, and updated match profile", matchProf: finalSM, isMatch: false});
                        })
                        .catch(err => {
                            return res.status(422).json({success: false, msg: "Something went wrong trying to update you match profile"}, err);
                        })
                    })
                    .catch(err => {
                        return res.status(422).json({success: false, msg: "Something went wrong trying to update employer match profile", err});
                    })
                }

            })
            .catch(err => {
                return res.status(422).json({success: false, msg: "Something went wrong trying to update your match profile", err});
            })
        })
        .catch(err => {
            return res.status(422).json({success: false, msg: "Something went wrong trying to update employer match profile", err});
        })
    })
    .catch(err => {
        return res.status(422).json({success: false, msg: "Something went wrong trying to swipe right on job.", err});
    })
})

router.put('/swipeLeft/:jobId', ensureAuthorisation, (req, res) => {
    Job.findOneAndUpdate(
        {_id: req.params.jobId},
        {
            $push: {swipedLeftOnMe: req.user.matchProfile}
        },
        {
            new: true,
            returnNewDocument: true
        }
    )
    .then(swipedLeftJob => {
        MatchProfile.findOne({_id: swipedLeftJob.matchProfile})
        .then(swipedleftEmpProf => {
            MatchProfile.findOneAndUpdate(
                {_id: swipedLeftJob.matchProfile},
                {
                    $push: {swipedLeftOnMe: req.user.matchProfile},
                    $set: {ir: swipedleftEmpProf.swipedRightOnMe.length/swipedleftEmpProf.swipedLeftOnMe.length+1}
                },
                {
                    new: true,
                    returnNewDocument: true
                }
            )
            .then(slj => {
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
                .then(finalSMP => {
                    return res.status(200).json({success: true, msg: "Swiped left on job, and edited match profile", matchProf: finalSMP})
                })
                .catch(err => {
                    return res.status(422).json({success: false, msg: "Something went wrong; swiped left but couldn't update match profile", err});
                })
            })
            .catch(err => {
                return res.status(422).json({success: false, msg: "Something went wrong trying to swipe left on job", err})
            })
        })
        .catch(err => {
            return res.status(422).json({success: false, msg: "Something went wrong trying to swipe left on job", err})
        })
    })
    .catch(err => {
        return res.status(422).json({success: false, msg: "Something went wrong trying to swipe left on job", err})
    })
});

router.put('/skipSwipe/:jobId', ensureAuthorisation, (req, res) => {
    Job.findOne({_id: req.params.jobId})
    .then(job => {
        MatchProfile.findOneAndUpdate(
            {_id: req.user.matchProfile},
            {
                $pop: {candidates: -1},
                $push: {candidates: job}
            }
        )
        .then(updatedSTUDProf => {
            return res.status(200).json({success: true, msg: "Skipped job", matchProf: updatedSTUDProf});
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
    .then(studmp => {
        let cands = studmp.candidates;
        return res.status(200).json({success: true, msg: "Retrieved matching candidates.", candidates: cands})
    })
    .catch(err => {
        return res.status(422).json({success: false, msg: "Trouble getting candidates", err});
    })
});

router.get('/getMatches', ensureAuthorisation, (req, res) => {
    let matchObjArr = [];
    Match.find({studentId: req.user._id})
    .then(matches => {
        if(matches.length === 0) {
            return res.status(200).json({success: true, msg: "No matches just yet; keep swiping.", matches});
        }
        matches.map((m, idx) => {
            let curM = {};
            Employer.findOne({_id: m.employerId})
            .then(emp => {
                emp.password = null;
                curM['employer'] = emp;
                Recruiter.findOne({_id: m.recruiterId})
                .then(rec => {
                    rec.password = null;
                    curM['recruiter'] = rec;
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