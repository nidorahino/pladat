import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import student from './StudentReducer';
import employer from './EmployerReducer';
import job from './JobReducer';
import recruiter from './RecruiterReducer';
import user from './UserReducer';
// import socket from './SocketReducer';


const rootReducer = combineReducers({
    students: student,
    employers: employer,
    user,
    jobs: job,
    recruiters: recruiter,
    // socket,
    routing: routerReducer
});

export default rootReducer;