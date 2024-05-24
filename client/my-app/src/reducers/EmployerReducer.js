import { EmployerConstants } from '../constants';

const initialState = {
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

function employer(state = initialState, action) {
    switch(action.type) {
        case EmployerConstants.EDITING_EMPLOYER_PROFILE:
            return {
                ...state, 
                editingEmployerProfile: true,
                employerActionState: action.type
            };
        case EmployerConstants.EDITING_EMPLOYER_PROFILE_SUCCESS:
            return {
                ...state,
                editingEmployerProfile: false,
                employerActionState: action.type,
                serverMsg: action.msg,
                curUserIsEmployer: true,
                curUserProfile: action.user,
                basicSuccessEmp: action.isBasic && action.isBasic === true ? true: false
            };
        case EmployerConstants.EDITING_EMPLOYER_PROFILE_FAIL:
            return {
                ...state,
                editingEmployerProfile: false,
                employerActionState: action.type,
                serverMsg: action.msg,
                curUserProfile: null,
                curUserIsEmployer: false,
                employerProfileEditError: true
            };
        case EmployerConstants.VERIFYING_RECRUITER:
            return {
                ...state,
                verifyingRecruiter: true,
                employerActionState: action.type
            };
        case EmployerConstants.VERIFYING_RECRUITER_SUCCESS:
            return {
                ...state,
                verifyingRecruiter: false,
                employerActionState: action.type,
                curRecruiter: action.recruiter,
                curUserProfile: action.user,
                serverMsg: action.msg
            };
        case EmployerConstants.VERIFYING_RECRUITER_FAIL:
            return {
                ...state,
                verifyingRecruiter: false,
                employerActionState: action.type,
                serverMsg: action.msg
            };
        case EmployerConstants.GETTING_EMPLOYERS:
            return {
                ...state,
                isLoadingEmployers: true,
                employerActionState: action.type
            };
        case EmployerConstants.GETTING_EMPLOYERS_SUCCESS:
            return {
                ...state,
                isLoadingEmployers: false,
                employerActionState: action.type,
                employers: [...state.employers, ...action.employers],
                serverMsg: action.msg,
                employersLoaded: true
            };
        case EmployerConstants.GETTING_EMPLOYERS_FAIL:
            return {
                ...state,
                isLoadingEmployers: false,
                employerActionState: action.type,
                serverMsg: action.msg,
                loadingEmployersError: true,
                employersLoaded: false
            };
        case EmployerConstants.GETTING_EMPLOYER_PROFILE:
            return {
                ...state,
                employerActionState: action.type,
                loadingSingleEmployer: true
            };
        case EmployerConstants.GETTING_EMPLOYER_PROFILE_SUCCESS:
            return {
                ...state,
                employerActionState: action.type,
                loadingSingleEmployer: false,
                singleEmployerLoadError: false,
                singleEmployerProfile: action.employerProfile,
                serverMsg: action.msg
            };
        case EmployerConstants.GETTING_EMPLOYER_PROFILE_FAIL:
            return {
                ...state,
                employerActionState: action.type,
                loadingSingleEmployer: false,
                singleEmployerLoadError: true,
                singleEmployerProfile: null,
                serverMsg: action.msg
            };
        case EmployerConstants.EMPLOYER_CREATING_JOB:
            return {
                ...state,
                employerActionState: action.type,
                creatingJob: true,
                editingJob: false,
                removingJob: false,
                jobCreateError: false,
                jobEditError: false,
                jobDeleteError: false,
                jobCreateSuccess: false
            };
        case EmployerConstants.EMPLOYER_CREATE_JOB_SUCCESS:
            return {
                ...state,
                employerActionState: action.type,
                creatingJob: false,
                jobCreateError: false,
                jobEditError: false,
                jobDeleteError: false,
                curJob: action.jobCreated,
                serverMsg: action.msg,
                jobCreateSuccess: true
            };
        case EmployerConstants.EMPLOYER_CREATE_JOB_FAIL:
            return {
                ...state,
                employerActionState: action.type,
                creatingJob: false,
                jobCreateError: true,
                jobEditError: false,
                jobDeleteError: false,
                serverMsg: action.msg
            };
        case EmployerConstants.EMPLOYER_EDITING_JOB:
            return {
                ...state,
                employerActionState: action.type,
                editingJob: true,
                creatingJob: false,
                removingJob: false
            };
        case EmployerConstants.EMPLOYER_EDITING_JOB_SUCCESS:
            return {
                ...state,
                employerActionState: action.type,
                editingJob: false,
                jobEditError: false,
                jobCreateError: false,
                jobDeleteError: false,
                serverMsg: action.msg,
                curJob: action.editedJob
            };
        case EmployerConstants.EMPLOYER_EDITING_JOB_FAIL:
            return {
                ...state,
                employerActionState: action.type,
                editingJob: false,
                jobEditError: true,
                jobCreateError: false,
                jobDeleteError: false,
                serverMsg: action.msg,
            };
        case EmployerConstants.EMPLOYER_REMOVING_JOB:
            return {
                ...state,
                employerActionState: action.type,
                removingJob: true,
                editingJob: false,
                creatingJob: false,
            };
        case EmployerConstants.EMPLOYER_REMOVING_JOB_SUCCESS:
            return {
                ...state,
                employerActionState: action.type,
                removingJob: false,
                jobDeleteError: false,
                jobCreateError: false,
                jobEditError: false,
                serverMsg: action.msg,
                curJob: action.removedJob
            };
        case EmployerConstants.EMPLOYER_REMOVING_JOB_FAIL:
            return {
                ...state,
                employerActionState: action.type,
                removingJob: false,
                jobDeleteError: true,
                jobCreateError: false,
                jobEditError: false,
                serverMsg: action.msg,
            };
        case EmployerConstants.ASSIGNING_RECRUITER_JOB:
            return {
                ...state,
                assigningRecruiter: true,
                employerActionState: action.type
            };
        case EmployerConstants.ASSIGN_RECRUITER_JOB_SUCCESS:
            return {
                ...state,
                employerActionState: action.type,
                assigningRecruiter: false,
                curJob: action.assignedJob,
                serverMsg: action.msg
            };
        case EmployerConstants.ASSIGN_RECRUITER_JOB_FAIL:
            return {
                ...state,
                employerActionState: action.type,
                assigningRecruiter: false,
                serverMsg: action.msg
            };
        case EmployerConstants.SEARCHING_EMPLOYERS:
            return {
                ...state,
                employerActionState: action.type,
                searchingCompanys: true
            };
        case EmployerConstants.SEARCH_QUERY_SUCCESS:
            return {
                ...state,
                employerActionState: action.type,
                serverMsg: action.msg,
                searchResults: [...action.employers],
                searchingCompanys: false,
                searchResultsLoaded: true,
                searchQueryFail: false
            };
        case EmployerConstants.SEARCH_QUERY_FAIL:
            return {
                ...state,
                employerActionState: action.type,
                serverMsg: action.msg,
                searchingCompanys: false,
                searchResultsLoaded: false,
                searchQueryFail: true
            }
        default:
            return state;
    }
}
export default employer;