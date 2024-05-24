import { JobConstants } from '../constants';

const initialState = {
    gettingSingleJob: false,
    singleJob: null,
    gettingSingleJobError: false,
    
    gettingJobs: false,
    gettingJobsError: false,
    jobs: [],
    jobsLoaded: false,

    jobsHashedToStorage: false,
    hashingJobsToStorage: false,
    hashingToStorageError: false,

    cache: {},

    serverMsg: null,
    jobActionState: null,


    loadingJobsFromStore: false
};

function job(state = initialState, action) {
    switch(action.type) {
        case JobConstants.GETTING_SINGLE_JOB:
            return {
                ...state,
                gettingSingleJob: true,
                jobActionState: action.type,
            };
        case JobConstants.GETTING_SINGLE_JOB_SUCCESS:
            return {
                ...state,
                gettingSingleJob: false,
                gettingSingleJobError: false,
                singleJob: action.job,
                serverMsg: action.msg,
                jobActionState: action.type
            };
        case JobConstants.GETTING_SINGLE_JOB_FAIL:
            return {
                ...state,
                gettingSingleJobError: true,
                gettingSingleJob: false,
                serverMsg: action.msg,
                jobActionState: action.type
            }
        case JobConstants.GETTING_JOBS:
            return {
                ...state,
                gettingJobs: true,
                jobActionState: action.type
            };
        case JobConstants.GETTING_JOBS_SUCCESS:
            return {
                ...state,
                jobsLoaded: true,
                jobs: [...state.jobs, ...action.jobs],
                jobActionState: action.type,
                gettingJobs: false,
                serverMsg: action.msg
            };
        case JobConstants.GETTING_JOBS_FAIL:
            return {
                ...state,
                jobsLoaded: false,
                gettingJobsError: true,
                serverMsg: action.msg,
                gettingJobs: false
            }
        default:
            return state;
    }
}
export default job;