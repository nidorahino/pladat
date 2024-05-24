const experss = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const events = require('events');
const express = require('express');
const dotenv = require("dotenv").config();
const http = require('http');


const PORT = process.env.PORT || 8080;

const Job =  require('../models/Job');
const MatchProfile = require('../models/MatchProfile');
const Student = require('../models/Student');

const Queue = require('./Queue');

let eventEmmiter = new events.EventEmitter();


const workerApp = experss();

workerApp.use(express.json());
workerApp.use(bodyParser.urlencoded({extended: true}));


const dbUri = process.env.MONGO_URI_DEV;

mongoose
.connect(dbUri, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
.then(() => {
    console.log("worker connected to mongo cluster");
    eventEmmiter.emit('startBot');
})
.catch(err => {
    console.log(err);
});


const workServer = workerApp.listen(PORT, () => {
    console.log('worker running on port: ', PORT);
    
});




let JobQueue = new Queue();
let StudentQueue = new Queue();
let CompanyQueue = new Queue();

const listenForNewJobs = () => {
    console.log('listening for changes in jobs collection...');
    // const jobWatchPipeline = [
    //     {
    //         '$match': {
    //             '$or': [
    //                 {'$eq': ['operationType', 'insert']},
    //                 {'$eq': ['operationType', 'update']},
    //                 {'$eq': ['operationType', 'delete']}
    //             ]
    //         }
    //     }
    // ];
    // const jobWatchPipeline = [
    //     {
    //         '$match': {
    //             '$expr': {
    //                 '$or': [
    //                     {'$eq': ['operationType', 'insert']},
    //                     {'$eq': ['operationType', 'update']},
    //                     {'$eq': ['operationType', 'delete']}
    //                 ]
    //             }
    //         }
    //     }
    // ];

    const jobWatchPipeline = [
        {
            '$match': {
                '$or': [
                    {'$and': [{'operationType': 'insert'}, {'operationType': 'insert'}]},
                    {'$and': [{'operationType': 'update'}, {'operationType': 'update'}]},
                    {'$and': [{'operationType': 'delete'}, {'operationType': 'delete'}]}
                ]
            }
        }
    ];

    // const jobWatchPipeline = [
    //     {'$match': {'operationType': 'insert', 'operationType': 'update', 'operationType': 'delete'}}
    // ];

    const options = { 'fullDocument': 'updateLookup' };

    const jobStream = Job.watch(jobWatchPipeline, options);

    jobStream.on('change', next => {
        switch(next.operationType) {
            case 'insert':
                let newJob = next.fullDocument._id;
                eventEmmiter.emit('newJob', newJob);
                eventEmmiter.emit('qJob', newJob);
                return;
            case 'update':
                let updatedJob = next.documentKey._id;
                eventEmmiter.emit('newJob', updatedJob);
                eventEmmiter.emit('qJob', updatedJob);
                return;
            case 'delete':
                return;
            default:
                break;
        }
    })

}

const listenForMatchProfileChanges = () => {
    console.log('listening for changes in match profile collection...');
    // const profPipeLine = [
    //     {'$match': {'operationType': 'insert', 'operationType': 'update', 'operationType': 'delete'}}
    // ];

    const profPipeLine = [
        {
            '$match': {
                '$expr': {
                    '$or': [
                        {'$eq': ['operationType', 'insert']},
                        {'$eq': ['operationType', 'update']},
                        {'$eq': ['operationType', 'delete']}
                    ]
                }
            }
        }
    ];
    
    // const profPipeLine = [
    //     {
    //         '$match': {
    //             '$or': [
    //                 {'$eq': ['operationType', 'insert']},
    //                 {'$eq': ['operationType', 'update']},
    //                 {'$eq': ['operationType', 'delete']}
    //             ]
    //         }
    //     }
    // ];

        

    const options = { 'fullDocument': 'updateLookup' };

    const profileStream = MatchProfile.watch(profPipeLine, options); 

    profileStream.on('change', next => {
        switch(next.operationType) {
            case 'insert':
                if(next.fullDocument.psychType === 'Student') {
                    console.log('Student match profile inserted');
                    eventEmmiter.emit('qStudent', next.fullDocument._id);
                }
                else {
                    eventEmmiter.emit('qEmployer', next.fullDocument._id);
                }
                return;
            case 'update':
                if(next.fullDocument.psychType === 'Student') {
                    eventEmmiter.emit('qStudent', next.fullDocument._id);
                }
                else {
                    eventEmmiter.emit('qEmployer', next.fullDocument._id);
                }
                return;
            case 'delete':
                return;
            default: 
                return;
        }
    })
}

let START_JOB_CRON = false;
let START_EMP_CRON = false;
let START_STUD_CRON = false;

const listenForJobQueueChange = () => {
    console.log('listening for changes in Job Queue...');
    setInterval(() => {
        if(JobQueue.isEmpty() && START_JOB_CRON) {
            START_JOB_CRON = false;
            console.log('JobQueue is empty; stopping Job cron');
        }
        else if(!JobQueue.isEmpty() && !START_JOB_CRON) {
            START_JOB_CRON = true;
            eventEmmiter.emit('SJC');
            console.log('JobQueue is populated; starting Job cron');
        }
        else {
            console.log(`No JobQueue change... Status---> running cron: ${START_JOB_CRON}`)
        }
    }, 180000);
};
const listenForEmpQueueChange = () => {
    console.log('listening for changes in Employer Queue...');
    setInterval(() => {
        if(CompanyQueue.isEmpty() && START_EMP_CRON) {
            START_EMP_CRON = false;
            console.log('CompanyQueue is empty; stopping Company cron');
        }
        else if(!CompanyQueue.isEmpty() && !START_EMP_CRON) {
            START_EMP_CRON = true;
            eventEmmiter.emit('SEC');
            console.log('CompanyQueue is populated; starting Company cron');
        }
        else {
            console.log(`No CompanyQueue change... Status---> running cron: ${START_EMP_CRON}`)
        }
    }, 180000);
};
const listenForStudQueueChange = () => {
    console.log('listening for changes in Student Queue...');
    setInterval(() => {
        if(StudentQueue.isEmpty() && START_STUD_CRON) {
            START_STUD_CRON = false;
            console.log('StudentQueue is empty; stopping Student cron');
        }
        else if(!StudentQueue.isEmpty() && !START_STUD_CRON) {
            START_STUD_CRON = true;
            eventEmmiter.emit('SSC');
            console.log('StudentQueue is populated; starting Student cron');
        }
        else {
            console.log(`No StudentQueue change... Status---> running cron: ${START_STUD_CRON}`)
        }
    }, 120000);
};

eventEmmiter.on('SSC', () => {
    while(START_STUD_CRON) {
        let sId = StudentQueue.peek();
        if(sId) {
            MatchProfile.findOne({_id: sId})
            .then(studProfile => {
                Student.findOne({_id: studProfile.userId})
                .then(student => {
                    MatchProfile.updateMany(
                        {
                            psychType: studProfile.psychTarget,
                            'candidates._id': {$ne: student._id},
                            matches: {$nin: studProfile.matches},
                            '$or': [
                                { universityPref: {$in: studProfile.university} },
                                { majorPref: {$in: studProfile.majors} },
                                { skillsPref: {$in: studProfile.skills} },
                                { experiencePref: {$in: studProfile.experience} },
                                { personalityPref: {$in: studProfile.personality} },
                                { industries: {$in: studProfile.industries} }
                            ]
                        }, 
                        {
                            $push: {candidates: student}
                        }
                    )
                    .then(res => {
                        console.log(`Student: ${student._id} broadcast. matchCount: ${res.matchedCount}, modCount: ${res.modifiedCount}`);
                        StudentQueue.dequeue();
                    })
                    .catch(err => {
                        console.log(`Broadcasting student match profile ${sId} error`, err);
                        StudentQueue.dequeue();
                    })
                })
                .catch(err => {
                    console.log(`Broadcasting student match profile ${sId} error`, err);
                    StudentQueue.dequeue();
                })
            })
            .catch(err => {
                console.log(`Broadcasting student match profile ${sId} error`, err);
                StudentQueue.dequeue();
            });
        }
    }
});


eventEmmiter.on('SJC', () => {
    while(START_JOB_CRON) {
        let jobId = JobQueue.peek();
        if(jobId) {
            Job.findOne({_id: jobId})
            .then(job => {
                const jobTitleSplit = job.title.split(' ');
                const jobDescSplit = job.description.split(' ');
                const jobTodoSplit = job.todo.split(' ');
                MatchProfile.findOne({_id: job.matchProfile})
                .then(matchProf => {
                    MatchProfile.updateMany(
                        {
                            psychType: matchProf.psychTarget,
                            'candidates._id': {$ne: job._id},
                            matches: {$nin: matchProf.matches},
                            '$or': [
                                { skills: {$in: [job.skillsRequired]} },
                                { skills: {$in: [matchProf.skillsPref]} },
                                { skills: {$in: [...jobTitleSplit, ...jobDescSplit, ...jobTodoSplit]} },
                                { university: {$in: matchProf.universityPref} },
                                { majors: {$in: matchProf.majorPref} },
                                { majors: {$in: [...jobTitleSplit, ...jobDescSplit, ...jobTodoSplit]} },
                                { experience: {$in: [...matchProf.experiencePref, ...job.backgrounds]} },
                                { experience: {$in: [...jobTitleSplit, ...jobDescSplit, ...jobTodoSplit]} },
                                { roles: {$in: [...matchProf.roles, job.role]} },
                                { roles: {$in: [...jobTitleSplit, ...jobDescSplit, ...jobTodoSplit]} },
                                { personality: {$in: matchProf.personalityPref} },
                                { personality: {$in: [...jobTitleSplit, ...jobDescSplit, ...jobTodoSplit]} },
                                { locations: {$in: [...matchProf.locations, job.locations]} },
                                { jobTypes:  {$in: job.typeOfJob} },
                                { companies: {$in: job.companyId} },
                                { cgs: {$in: matchProf.cgs} },
                                { industries: {$in: [...matchProf.industries, job.industry]} },
                                { industries: {$in: [...jobTitleSplit, ...jobDescSplit, ...jobTodoSplit]} },
                                { workEnv: {$in: [...matchProf.workEnv, ...job.workEnv]} },
                                { compOffers: { $in: [...matchProf.compOffers, ...job.perks]} },
                                { pay: {$in: job.pay} }
                            ]
                        }, 
                        {
                            $push: { candidates: job }
                        }
                    )
                    .then(res => {
                        console.log(`Job: ${job._id} broadcast. matchCount: ${res.matchedCount}, modCount: ${res.modifiedCount}`);
                        JobQueue.dequeue();
                        JobQueue.enqueue(jobId);
                    })
                    .catch(err => {
                        console.log(`couldn't broadcast job: ${job._id} to matchProfiles`, err);
                        JobQueue.dequeue();
                        JobQueue.enqueue(jobId);
                    })
                })
                .catch(err => {
                    console.log('Broadcasting job error: ', err);
                    JobQueue.dequeue();
                    JobQueue.enqueue(jobId);
                })
            })
            .catch(err => {
                console.log('Broadcasting job error: ', err);
                JobQueue.dequeue();
                JobQueue.enqueue(jobId);
            })
        }
    }
})


eventEmmiter.on('qStudent', (studId) => {
    if(!StudentQueue.hasNode(studId)) {
        StudentQueue.enqueue(studId);
    }
});

eventEmmiter.on('qEmployer', (empId) => {
    if(!CompanyQueue.hasNode(empId)) {
        CompanyQueue.enqueue(empId);
    }
});

eventEmmiter.on('qJob', (jobId) => {
    if(!JobQueue.hasNode(jobId)) {
        JobQueue.enqueue(jobId);
    }
});

eventEmmiter.on('newJob', (jobId) => {
    Job.findOne({_id: jobId})
    .then(job => {
        const jobTitleSplit = job.title.split(' ');
        const jobDescSplit = job.description.split(' ');
        const jobTodoSplit = job.todo.split(' ');
        MatchProfile.findOne({_id: job.matchProfile})
        .then(matchProf => {
            MatchProfile.updateMany(
                {
                    psychType: matchProf.psychTarget,
                    'candidates._id': {$ne: job._id},
                    matches: {$nin: matchProf.matches},
                    '$or': [
                        { skills: {$in: [job.skillsRequired]} },
                        { skills: {$in: [matchProf.skillsPref]} },
                        { skills: {$in: [...jobTitleSplit, ...jobDescSplit, ...jobTodoSplit]} },
                        { university: {$in: matchProf.universityPref} },
                        { majors: {$in: matchProf.majorPref} },
                        { majors: {$in: [...jobTitleSplit, ...jobDescSplit, ...jobTodoSplit]} },
                        { experience: {$in: matchProf.experiencePref} },
                        { experience: {$in: [...jobTitleSplit, ...jobDescSplit, ...jobTodoSplit]} },
                        { roles: {$in: [...matchProf.roles, job.role]} },
                        { roles: {$in: [...jobTitleSplit, ...jobDescSplit, ...jobTodoSplit]} },
                        { personality: {$in: matchProf.personalityPref} },
                        { personality: {$in: [...jobTitleSplit, ...jobDescSplit, ...jobTodoSplit]} },
                        { locations: {$in: [...matchProf.locations, job.locations]} },
                        { jobTypes:  {$in: job.typeOfJob} },
                        { companies: {$in: job.companyId} },
                        { cgs: {$in: matchProf.cgs} },
                        { industries: {$in: [...matchProf.industries, job.industry]} },
                        { industries: {$in: [...jobTitleSplit, ...jobDescSplit, ...jobTodoSplit]} },
                        { workEnv: {$in: matchProf.workEnv} },
                        { compOffers: { $in: matchProf.compOffers} },
                    ]
                }, 
                {
                    $push: { candidates: job }
                }
            )
            .then(res => {
                console.log(`Job: ${job._id} broadcast. matchCount: ${res.matchedCount}, modCount: ${res.modifiedCount}`);
            })
            .catch(err => {
                console.log(`couldn't broadcast new job: ${job._id} to matchProfiles`, err)
            })
        })
        .catch(err => {
            console.log('Broadcasting new job error: ', err);
        })
    })
    .catch(err => {
        console.log('Broadcasting new job error: ', err);
    })
});

eventEmmiter.once('startBot', () => {
    console.log('starting bot event emmited...');
    listenForNewJobs();
    listenForMatchProfileChanges();
    listenForStudQueueChange();
    listenForJobQueueChange();
});

