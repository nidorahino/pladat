import axios from 'axios';
import { JobConstants } from '../constants';

import jwt from 'jsonwebtoken';
import { REDUX_PERSIST_KEY } from '../staticData/config';


export const getSingleJob = (jobId) => dispatch => {
    dispatch({type: JobConstants.GETTING_SINGLE_JOB});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };

    axios.put(`/api/job/getSingleJob/${jobId}`, {...configs})
    .then(res => {
        dispatch({
            type: JobConstants.GETTING_SINGLE_JOB_SUCCESS,
            msg: res.data.msg,
            job: res.data.job
        })
    })
    .catch(error => {
        dispatch({
            type: JobConstants.GETTING_SINGLE_JOB_FAIL,
            msg: error.response.data.msg,
        })
    })
}

export const getJobs = (jobId) => dispatch => {
    dispatch({type: JobConstants.GETTING_JOBS});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };

    axios.put(`/api/job/getJobs/${jobId}`, {...configs})
    .then(res => {
        dispatch({
            type: JobConstants.GETTING_JOBS_SUCCESS,
            msg: res.data.msg,
            jobs: res.data.jobs
        })
    })
    .catch(error => {
        dispatch({
            type: JobConstants.GETTING_JOBS_FAIL,
            msg: error.response.data.msg,
        })
    })
}

export const getJobsByIndustry = (industryId, skip) => dispatch => {
    dispatch({type: JobConstants.GETTING_JOBS});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };

    axios.put(`/api/job/getJobsByIndustry/${industryId}/${skip}`, {...configs})
    .then(res => {
        dispatch({
            type: JobConstants.GETTING_JOBS_SUCCESS,
            msg: res.data.msg,
            jobs: res.data.jobs
        })
    })
    .catch(error => {
        dispatch({
            type: JobConstants.GETTING_JOBS_FAIL,
            msg: error.response.data.msg,
        })
    })
}

export const getJobsByEmployer = (empId, skip) => dispatch => {
    dispatch({type: JobConstants.GETTING_JOBS});

    const configs = {
        headers: {
          'Content-Type': 'application/json'
        },
        proxy: {
            host: '127.0.0.1',
            port: 5000
        },
    };

    axios.put(`/api/job/getJobsByEmployer/${empId}/${skip}`, {...configs})
    .then(res => {
        dispatch({
            type: JobConstants.GETTING_JOBS_SUCCESS,
            msg: res.data.msg,
            jobs: res.data.jobs
        })
    })
    .catch(error => {
        dispatch({
            type: JobConstants.GETTING_JOBS_FAIL,
            msg: error.response.data.msg,
        })
    })
}

