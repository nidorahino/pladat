import axios from 'axios';
import { StudentConstants } from '../constants';

import jwt from 'jsonwebtoken';
import { REDUX_PERSIST_KEY } from '../staticData/config';

import { hashToLocalStroage } from './UserActions';

export const completeBasicProfile = (basicInfo) => dispatch => {
    dispatch({type: StudentConstants.EDITING_STUDENT_PROFILE});

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

    axios.put('/api/student/completeBasicProfile', requestBody, {params: {userType: 'Student'}, ...configs})
    .then(res => {
        dispatch({
            type: StudentConstants.STUDENT_PROFILE_EDIT_SUCCESS,
            msg: res.data.msg,
            user: res.data.student,
            isBasic: true
        });
        dispatch(hashToLocalStroage(res.data.student));
    })
    .catch(error => {
        dispatch({
            type: StudentConstants.STUDENT_PROFILE_EDIT_FAIL,
            msg: error.response.data.msg,
        })
    })
}

export const updateMatchProfile = () => dispatch => {
    dispatch({type: StudentConstants.EDITING_STUDENT_PROFILE});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };

    // const requestBody = JSON.stringify({...matchProfile});

    axios.put('/api/student/updateMatchProfile', {params: {userType: 'Student'}, ...configs})
    .then(res => {
        dispatch({
            type: StudentConstants.STUDENT_PROFILE_EDIT_SUCCESS,
            msg: res.data.msg,
            matchProf: res.data.mp
        });
        dispatch(hashToLocalStroage(res.data.student));
    })
    .catch(error => {
        dispatch({
            type: StudentConstants.STUDENT_PROFILE_EDIT_FAIL,
            msg: error.response.data.msg,
        })
    })
}

export const editProfile = (profile) => dispatch => {
    dispatch({type: StudentConstants.EDITING_STUDENT_PROFILE});

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

    axios.put('/api/student/editProfile', requestBody, {params: {userType: 'Student'}, ...configs})
    .then(res => {
        dispatch({
            type: StudentConstants.STUDENT_PROFILE_EDIT_SUCCESS,
            msg: res.data.msg,
            user: res.data.student
        });
        dispatch(updateMatchProfile());
        dispatch(hashToLocalStroage(res.data.student));
    })
    .catch(error => {
        dispatch({
            type: StudentConstants.STUDENT_PROFILE_EDIT_FAIL,
            msg: error.response.data.msg,
        })
    })
}

export const swipeRight = (jobId) => dispatch => {
    dispatch({type: StudentConstants.STUDENT_SWIPING});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };


    axios.put('/api/student/swipeRight/'+jobId, {params: {userType: 'Student'}, ...configs})
    .then(res => {
        dispatch({
            type: StudentConstants.STUDENT_SWIPE_RIGHT,
            msg: res.data.msg,
            matchProfile: res.data.matchProf,
            isMatch: res.data.isMatch
        });
    })
    .catch(error => {
        dispatch({
            type: StudentConstants.STUDENT_SWIPE_FAIL,
            msg: error.response.data.msg,
        })
    })
}

export const swipeLeft = (jobId) => dispatch => {
    dispatch({type: StudentConstants.STUDENT_SWIPING});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };


    axios.put('/api/student/swipeLeft/'+jobId, {params: {userType: 'Student'}, ...configs})
    .then(res => {
        dispatch({
            type: StudentConstants.STUDENT_SWIPE_LEFT,
            msg: res.data.msg,
            matchProfile: res.data.matchProf
        });
    })
    .catch(error => {
        dispatch({
            type: StudentConstants.STUDENT_SWIPE_FAIL,
            msg: error.response.data.msg,
        })
    })
}

export const getStudent = (sId) => dispatch => {
    dispatch({type: StudentConstants.GETTING_STUDENT_PROFILE});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };

    axios.get(`/api/student/getStudent/${sId}`, {...configs})
    .then(res => {
        dispatch({
            type: StudentConstants.GETTING_STUDENT_PROFILE_SUCCESS,
            msg: res.data.msg,
            studentProfile: res.student
        })
    })
    .catch(error => {
        dispatch({
            type: StudentConstants.GETTING_STUDENT_PROFILE_FAIL,
            msg: error.response.data.msg
        })
    })
}

export const skipSwipe = (jobId) => dispatch => {
    dispatch({type: StudentConstants.STUDENT_SWIPING});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };


    axios.put('/api/student/skipSwipe/'+jobId, {params: {userType: 'Student'}, ...configs})
    .then(res => {
        dispatch({
            type: StudentConstants.STUDENT_SWIPE_LEFT,
            msg: res.data.msg,
            matchProfile: res.data.matchProf
        });
    })
    .catch(error => {
        dispatch({
            type: StudentConstants.STUDENT_SWIPE_FAIL,
            msg: error.response.data.msg,
        })
    })
}

