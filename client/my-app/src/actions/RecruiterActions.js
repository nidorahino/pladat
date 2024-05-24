import axios from 'axios';
import { RecruiterConstants } from '../constants';

import jwt from 'jsonwebtoken';
import { REDUX_PERSIST_KEY } from '../staticData/config';

import { hashToLocalStroage } from './UserActions';



export const completeBasicProfile = (basicInfo) => dispatch => {
    dispatch({type: RecruiterConstants.EDITING_RECRUITER_PROFILE});

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

    axios.put('/api/recruiter/completeBaiscProfile', requestBody, {params: {userType: 'Recruiter'}, ...configs})
    .then(res => {
        dispatch({
            type: RecruiterConstants.VERIFY_AS_RECRUITER_EMAIL_SENT,
            msg: res.data.msg,
            user: res.data.recruiter,
            isBasic: true
        });
        dispatch(hashToLocalStroage(res.data.recruiter));
    })
    .catch(error => {
        dispatch({
            type: RecruiterConstants.RECRUITER_PROFILE_EDIT_FAIL,
            msg: error.response.data.msg,
        })
    })
}

export const updateMatchProfile = () => dispatch => {
    dispatch({type: RecruiterConstants.EDITING_RECRUITER_PROFILE});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };


    axios.put('/api/recruiter/updateMatchProfile', {params: {userType: 'Recruiter'}, ...configs})
    .then(res => {
        dispatch({
            type: RecruiterConstants.RECRUITER_PROFILE_EDIT_SUCCESS,
            msg: res.data.msg,
            user: res.data.recruiter
        });
        dispatch(hashToLocalStroage(res.data.recruiter));
    })
    .catch(error => {
        dispatch({
            type: RecruiterConstants.RECRUITER_PROFILE_EDIT_FAIL,
            msg: error.response.data.msg,
        })
    })
}

export const editProfile = (profile) => dispatch => {
    dispatch({type: RecruiterConstants.EDITING_RECRUITER_PROFILE});

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

    axios.put('/api/recruiter/editProfile', requestBody, {params: {userType: 'Recruiter'}, ...configs})
    .then(res => {
        dispatch({
            type: RecruiterConstants.RECRUITER_PROFILE_EDIT_SUCCESS,
            msg: res.data.msg,
            user: res.data.recruiter
        });
        dispatch(hashToLocalStroage(res.data.recruiter));
        // dispatch(updateMatchProfile());
    })
    .catch(error => {
        dispatch({
            type: RecruiterConstants.RECRUITER_PROFILE_EDIT_FAIL,
            msg: error.response.data.msg,
        })
    })
}

export const swipeRight = (studentId) => dispatch => {
    dispatch({type: RecruiterConstants.RECRUITER_SWIPING});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };


    axios.put('/api/recruiter/swipeRight/'+studentId, {params: {userType: 'Recruiter'}, ...configs})
    .then(res => {
        dispatch({
            type: RecruiterConstants.RECRUITER_SWIPE_RIGHT,
            msg: res.data.msg,
            matchProfile: res.data.matchProf,
            isMatch: res.data.isMatch
        });
    })
    .catch(error => {
        dispatch({
            type: RecruiterConstants.RECRUITER_SWIPE_FAIL,
            msg: error.response.data.msg,
        });
    })
}

export const swipeLeft = (studentId) => dispatch => {
    dispatch({type: RecruiterConstants.RECRUITER_SWIPING});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };
    axios.put('/api/recruiter/swipeLeft/'+studentId, {params: {userType: 'Recruiter'}, ...configs})
    .then(res => {
        dispatch({
            type: RecruiterConstants.RECRUITER_SWIPE_LEFT,
            msg: res.data.msg,
            matchProfile: res.data.matchProf
        });
    })
    .catch(error => {
        dispatch({
            type: RecruiterConstants.RECRUITER_SWIPE_FAIL,
            msg: error.response.data.msg,
        })
    })
}

export const skipSwipe = (studentId) => dispatch => {
    dispatch({type: RecruiterConstants.RECRUITER_SWIPING});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };


    axios.put('/api/recruiter/skipSwipe/'+studentId, {params: {userType: 'Recruiter'}, ...configs})
    .then(res => {
        dispatch({
            type: RecruiterConstants.RECRUITER_SWIPE_LEFT,
            msg: res.data.msg,
            matchProfile: res.data.matchProf
        });
    })
    .catch(error => {
        dispatch({
            type: RecruiterConstants.RECRUITER_SWIPE_FAIL,
            msg: error.response.data.msg,
        })
    })
}

export const getRecruiter = (rId) => dispatch => {
    dispatch({type: RecruiterConstants.GETTING_RECRUITER_PROFILE});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };

    axios.get(`/api/recruiter/getRecruiter/${rId}`, {...configs})
    .then(res => {
        dispatch({
            type: RecruiterConstants.GET_RECRUITER_PROFILE_SUCCESS,
            msg: res.data.msg,
            recruiterProfile: res.data.recruiter
        })
    })
    .catch(error => {
        dispatch({
            type: RecruiterConstants.GET_RECRUITER_PROFILE_FAIL,
            msg: error.response.data.msg
        })
    })
}

export const getRecruiterOnJob = (jobId) => dispatch => {
    dispatch({type: RecruiterConstants.GETTING_RECRUITER_PROFILE});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };

    axios.get(`/api/recruiter/getRecruiterOnJob/${jobId}`, {...configs})
    .then(res => {
        dispatch({
            type: RecruiterConstants.GET_RECRUITER_PROFILE_SUCCESS,
            msg: res.data.msg,
            recruiterProfile: res.data.recruiter
        })
    })
    .catch(error => {
        dispatch({
            type: RecruiterConstants.GET_RECRUITER_PROFILE_FAIL,
            msg: error.response.data.msg
        })
    })

}

export const getRecruitersForCompany = (empId) => dispatch => {
    dispatch({type: RecruiterConstants.GETTING_RECRUITERS});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };

    axios.get(`/api/recruiter/getRecruitersForCompany/${empId}`, {...configs})
    .then(res => {
        dispatch({
            type: RecruiterConstants.GETTING_RECRUITERS_SUCCESS,
            msg: res.data.msg,
            recruiterList: res.data.recruiters
        })
    })
    .catch(error => {
        dispatch({
            type: RecruiterConstants.GETTING_RECRUITERS_FAIL,
            msg: error.response.data.msg
        })
    })
}