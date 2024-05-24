import { createStore, compose , applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers/index.js';



let socket = {
    fake: null
};

let employers = {
    employers: [],
    isLoadingEmployers: false,
    employersLoaded: false,
    loadingEmployersError: false,

    editingEmployerProfile: false,
    employerProfileEditError: false,

    loadingSingleEmployer: false,
    singleEmployerLoadError: false,
    singleEmployerProfile: null,

    curUserIsEmployer: false,
    curUserProfile: null,

    employerActionState: null,

    editingJob: false,
    jobEditError: false,
    creatingJob: false,
    jobCreateError: false,
    removingJob: false,
    jobDeleteError: false,
    curJob: null,
    jobCreateSuccess: false,

    verifyingRecruiter: false,
    assigningRecruiter: false,
    curRecruiter: null,

    serverMsg: null,


    hashingCompsToStorage: false,
    hashingCompsToStorageError: false,
    hashedCompsToStorage: false,

    loadingCompsFromStore: false,

    searchingCompanys: false,
    searchResultsLoaded: false,
    searchResults: [],
    searchQueryFail: false,

    basicSuccessEmp: false

};

let recruiters = {
    recruiters: [],
    curUserIsRecruiter: false,
    isLoadingRecruiters: false,
    recruitersLoaded: false,
    loadingRecruitersError: false,
    editingRecruiterProfile: false,
    recruiterProfileEditError: false,
    serverMsg: null,
    recruiterSwiping: false,
    recruiterSwipingError: false,
    prevSwipeDirection: null,
    prevSwipeId: null,
    prevSwipeStudent: null,
    recruiterActionState: null,
    recruiterUser: null,
    gettingSingleRecruiter: false,
    gettingSingleRecruiterError: false,
    singleRecruiterProfile: null,

    hashingRecsToStorage: false,
    hashingRecsToStorageError: false,
    hashedRecsToStorage: false,

    loadingRecsFromStore: false,

    basicSuccessR: false
};

let students = {
    students: [],
    curUserIsStudent: false,
    loadingStudents: false,
    studentsLoaded: false,
    serverMsg: null,
    editingStudentProfile: false,
    studentEditingError: false,
    studentSwiping: false,
    studentSwipingError: false,
    prevSwipeDirection: null,
    prevSwipeId: null,
    prevSwipeJob: null,
    studentActionState: null,
    gettingSingleStudent: false,
    gettingSingleStudentError: false,
    singleStudentProfile: null,
    studentUser: null,

    hashingStudsToStorage: false,
    hashingStudsToStorageError: false,
    hashedStudsToStorage: false,

    loadingStudsFromStore: false,

    basicSuccessStud: false
};

let jobs = {
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

let user = {
    isLoading: false,
    verifyingAuth: false,
    loggingInUser: false,
    loggedIn: false,
    hashedToStore: false,
    hashingToLocalStorage: false,
    removingFromLocalStorage: false,
    awaitingEmailVerification: false,
    isAuthenticated: false,
    userLoginVerified: false,
    userLoginVerificationFail: false,
    emailIsValidated: false,
    user: null,
    preliminaryInfo: null,
    authMessage: null,
    authError: [],
    errorsDidChange: false,
    authState: null,
    serverStatus: null,

    userMatches: [],

    uploadingImg: false,
    imgUploadError: false,
    upLoadedImg: null,

    editingDefaultUser: false,
    defaultEditFail: false,
    defaultEditSuccess: false,

    imagesUpdated: false,
    editFields: {},

    matchProfile: null,
    
    candidates: [],
    gettingCandidates: false,
    gettingCandidatesError: false,
    candidatesLoaded: false,

    gettingMatches: false,
    gettingMatchesError: false,
    matchesLoaded: false
};

const defaultState = {
    jobs,
    employers,
    recruiters,
    user,
    students,
    // socket
};


const middleware = [thunk];


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, defaultState, composeEnhancers(applyMiddleware(...middleware)));


if(module.hot) {
    module.hot.accept('./reducers/',() => {
      const nextRootReducer = require('./reducers/index').default;
      store.replaceReducer(nextRootReducer);
    });
}


export default store;