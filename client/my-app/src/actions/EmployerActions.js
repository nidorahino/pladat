import axios from 'axios';
import { EmployerConstants } from '../constants';

import jwt from 'jsonwebtoken';
import { REDUX_PERSIST_KEY } from '../staticData/config';
import { hashToLocalStroage } from './UserActions';





export const completeBasicProfile = (basicInfo) => dispatch => {
    dispatch({type: EmployerConstants.EDITING_EMPLOYER_PROFILE});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };

    const requestBody = JSON.stringify({...basicInfo});

    axios.put('/api/employer/completeBaiscProfile', requestBody, {params: {userType: 'Employer'}, ...configs})
    .then(res => {
        dispatch({
            type: EmployerConstants.EDITING_EMPLOYER_PROFILE_SUCCESS,
            msg: res.data.msg,
            user: res.data.employer,
            isBasic: true
        });
        dispatch(hashToLocalStroage(res.data.employer));
    })
    .catch(error => {
        dispatch({
            type: EmployerConstants.EDITING_EMPLOYER_PROFILE_FAIL,
            msg: error.response.data.msg,
        })
    })
}

export const updateMatchProfile = () => dispatch => {
    dispatch({type: EmployerConstants.EDITING_EMPLOYER_PROFILE});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };


    axios.put('/api/employer/updateMatchProfile', {params: {userType: 'Employer'}, ...configs})
    .then(res => {
        dispatch({
            type: EmployerConstants.EDITING_EMPLOYER_PROFILE_SUCCESS,
            msg: res.data.msg,
            matchProfile: res.data.matchProf
        })
    })
    .catch(error => {
        dispatch({
            type: EmployerConstants.EDITING_EMPLOYER_PROFILE_FAIL,
            msg: error.response.data.msg,
        })
    })
}

export const editProfile = (profile) => dispatch => {
    dispatch({type: EmployerConstants.EDITING_EMPLOYER_PROFILE});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };

    const requestBody = JSON.stringify({...profile});

    axios.put('/api/employer/editProfile', requestBody, {params: {userType: 'Employer'}, ...configs})
    .then(res => {
        dispatch({
            type: EmployerConstants.EDITING_EMPLOYER_PROFILE_SUCCESS,
            msg: res.data.msg,
            user: res.data.employer
        });
        dispatch(updateMatchProfile());
    })
    .catch(error => {
        dispatch({
            type: EmployerConstants.EDITING_EMPLOYER_PROFILE_FAIL,
            msg: error.response.data.msg,
        })
    })
}

export const verifyRecruiter = (empId, rToken) => dispatch => {
    dispatch({type: EmployerConstants.VERIFYING_RECRUITER});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };

    axios.put(`/api/employer/verify-recruiter/${empId}/${rToken}`, {params: {userType: 'Employer'}, ...configs})
    .then(res => {
        dispatch({
            type: EmployerConstants.VERIFYING_RECRUITER_SUCCESS,
            msg: res.data.msg,
            recruiter: res.data.recruiter,
            user: res.data.employer
        })
    })
    .catch(error => {
        dispatch({
            type: EmployerConstants.VERIFYING_RECRUITER_FAIL,
            msg: error.response.data.msg
        })
    })
}

export const getEmployer = (empId) => dispatch => {
    dispatch({type: EmployerConstants.GETTING_EMPLOYER_PROFILE});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };

    axios.put(`/api/employer/getEmployer/${empId}`, {...configs})
    .then(res => {
        dispatch({
            type: EmployerConstants.GETTING_EMPLOYER_PROFILE_SUCCESS,
            msg: res.data.msg,
            employerProfile: res.data.employer
        })
    })
    .catch(error => {
        dispatch({
            type: EmployerConstants.GETTING_EMPLOYER_PROFILE_FAIL,
            msg: error.response.data.msg
        })
    })

}

export const getAllEmployers = (skip) => dispatch => {
    dispatch({type: EmployerConstants.GETTING_EMPLOYERS});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };

    axios.put(`/api/employer/getAllEmployers/${skip}`, {...configs})
    .then(res => {
        dispatch({
            type: EmployerConstants.GETTING_EMPLOYERS_SUCCESS,
            msg: res.data.msg,
            employers: res.data.employers
        })
    })
    .catch(error => {
        dispatch({
            type: EmployerConstants.GETTING_EMPLOYERS_FAIL,
            msg: error.response.data.msg,
            employers: []
        })
    })

}

export const getEmployersByIndustry = (industry, skip) => dispatch => {
    dispatch({type: EmployerConstants.GETTING_EMPLOYERS});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };

    axios.put(`/api/employer/getByIndustry/${industry}/${skip}`, {...configs})
    .then(res => {
        dispatch({
            type: EmployerConstants.GETTING_EMPLOYERS_SUCCESS,
            msg: res.data.msg,
            employers: res.data.employers
        })
    })
    .catch(error => {
        dispatch({
            type: EmployerConstants.GETTING_EMPLOYERS_FAIL,
            msg: error.response.data.msg,
            employers: []
        })
    })

}


export const createJob = (jobDetails) => dispatch => {
    dispatch({type: EmployerConstants.EMPLOYER_CREATING_JOB});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };

    const requestBody = JSON.stringify({...jobDetails});

    axios.post('/api/employer/createJob', requestBody, {params: {userType: 'Employer'}, ...configs})
    .then(res => {
        dispatch({
            type: EmployerConstants.EMPLOYER_CREATE_JOB_SUCCESS,
            msg: res.data.msg,
            jobCreated: res.data.job
        })
    })
    .catch(error => {
        dispatch({
            type: EmployerConstants.EMPLOYER_CREATE_JOB_FAIL,
            msg: error.response.data.msg,
        })
    })

}


export const editJob = (jobId) => dispatch => {
    dispatch({type: EmployerConstants.EMPLOYER_EDITING_JOB});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };


    axios.put(`/api/employer/editJob/${jobId}`, {params: {userType: 'Employer'}, ...configs})
    .then(res => {
        dispatch({
            type: EmployerConstants.EMPLOYER_EDITING_JOB_SUCCESS,
            msg: res.data.msg,
            editedJob: res.data.job
        })
    })
    .catch(error => {
        dispatch({
            type: EmployerConstants.EMPLOYER_EDITING_JOB_FAIL,
            msg: error.response.data.msg,
        })
    })

}


export const unlistJob = (jobId) => dispatch => {
    dispatch({type: EmployerConstants.EMPLOYER_EDITING_JOB});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };


    axios.put(`/api/employer/unlistJob/${jobId}`, {params: {userType: 'Employer'}, ...configs})
    .then(res => {
        dispatch({
            type: EmployerConstants.EMPLOYER_EDITING_JOB_SUCCESS,
            msg: res.data.msg,
            editedJob: res.data.job
        })
    })
    .catch(error => {
        dispatch({
            type: EmployerConstants.EMPLOYER_EDITING_JOB_FAIL,
            msg: error.response.data.msg,
        })
    })

}

export const relistJob = (jobId) => dispatch => {
    dispatch({type: EmployerConstants.EMPLOYER_EDITING_JOB});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };


    axios.put(`/api/employer/relistJob/${jobId}`, {params: {userType: 'Employer'}, ...configs})
    .then(res => {
        dispatch({
            type: EmployerConstants.EMPLOYER_EDITING_JOB_SUCCESS,
            msg: res.data.msg,
            editedJob: res.data.job
        })
    })
    .catch(error => {
        dispatch({
            type: EmployerConstants.EMPLOYER_EDITING_JOB_FAIL,
            msg: error.response.data.msg,
        })
    })

}

export const removeJob = (jobId) => dispatch => {
    dispatch({type: EmployerConstants.EMPLOYER_REMOVING_JOB});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };


    axios.put(`/api/employer/removeJob/${jobId}`, {params: {userType: 'Employer'}}, {...configs})
    .then(res => {
        dispatch({
            type: EmployerConstants.EMPLOYER_REMOVING_JOB_SUCCESS,
            msg: res.data.msg,
            removedJob: res.data.job
        })
    })
    .catch(error => {
        dispatch({
            type: EmployerConstants.EMPLOYER_REMOVING_JOB_FAIL,
            msg: error.response.data.msg,
        })
    })

}


export const assignRecruiter = (jobId, rId) => dispatch => {
    dispatch({type: EmployerConstants.ASSIGNING_RECRUITER_JOB});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };

    axios.put(`/api/employer/assignRecruiter/${jobId}/${rId}`, {params: {userType: 'Employer'}}, {...configs})
    .then(res => {
        dispatch({
            type: EmployerConstants.ASSIGN_RECRUITER_JOB_SUCCESS,
            msg: res.data.msg,
            assignedJob: res.data.job
        })
    })
    .catch(error => {
        dispatch({
            type: EmployerConstants.ASSIGN_RECRUITER_JOB_FAIL,
            msg: error.response.data.msg,
        })
    })
}

export const employerSearchQuery = (query) => dispatch => {
    dispatch({type: EmployerConstants.SEARCHING_EMPLOYERS});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };

    axios.get(`/api/employer/queryByName/${query}`, {...configs})
    .then(res => {
        dispatch({
            type: EmployerConstants.SEARCH_QUERY_SUCCESS,
            msg: res.data.msg,
            employers: res.data.employers
        })
    })
    .catch(error => {
        dispatch({
            type: EmployerConstants.SEARCH_QUERY_FAIL,
            msg: error.response.data.msg,
        })
    })
}

export const swipeRight = (studentId) => dispatch => {
    dispatch({type: EmployerConstants.EMPLOYER_SWIPING});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };
    axios.put('/api/employer/swipeRight/'+studentId, {params: {userType: 'Employer'}, ...configs})
    .then(res => {
        dispatch({
            type: EmployerConstants.EMPLOYER_STUDENT_SWIPE_RIGHT,
            msg: res.data.msg,
            matchProfile: res.data.matchProf,
            isMatch: res.data.isMatch
        });
    })
    .catch(error => {
        dispatch({
            type: EmployerConstants.EMPLOYER_STUDENT_SWIPE_FAIL,
            msg: error.response.data.msg,
        });
    })
}

export const swipeLeft = (studentId) => dispatch => {
    dispatch({type: EmployerConstants.EMPLOYER_SWIPING});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };
    axios.put('/api/employer/swipeLeft/'+studentId, {params: {userType: 'Employer'}, ...configs})
    .then(res => {
        dispatch({
            type: EmployerConstants.EMPLOYER_STUDENT_SWIPE_LEFT,
            msg: res.data.msg,
            matchProfile: res.data.matchProf
        });
    })
    .catch(error => {
        dispatch({
            type: EmployerConstants.EMPLOYER_STUDENT_SWIPE_FAIL,
            msg: error.response.data.msg,
        })
    })
}

export const skipSwipe = (studentId) => dispatch => {
    dispatch({type: EmployerConstants.EMPLOYER_SWIPING});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };


    axios.put('/api/employer/skipSwipe/'+studentId, {params: {userType: 'Employer'}, ...configs})
    .then(res => {
        dispatch({
            type: EmployerConstants.EMPLOYER_STUDENT_SWIPE_LEFT,
            msg: res.data.msg,
            matchProfile: res.data.matchProf
        });
    })
    .catch(error => {
        dispatch({
            type: EmployerConstants.EMPLOYER_STUDENT_SWIPE_FAIL,
            msg: error.response.data.msg,
        })
    })
}


