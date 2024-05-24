import { RecruiterConstants } from '../constants';

const initialState = {
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

function recruiter(state = initialState, action) {
    switch(action.type) {
        case RecruiterConstants.EDITING_RECRUITER_PROFILE:
            return {
                ...state,
                editingRecruiterProfile: true,
                recruiterActionState: RecruiterConstants.EDITING_RECRUITER_PROFILE
            };
        case RecruiterConstants.RECRUITER_PROFILE_EDIT_SUCCESS:
        case RecruiterConstants.VERIFY_AS_RECRUITER_EMAIL_SENT:
            return {
                ...state,
                editingRecruiterProfile: false,
                recruiterActionState: RecruiterConstants.VERIFY_AS_RECRUITER_EMAIL_SENT,
                curUserIsRecruiter: true,
                recruiterUser: action.user,
                serverMsg: action.msg,
                basicSuccessR: action.isBasic && action.isBasic === true ? true: false
            };
        case RecruiterConstants.RECRUITER_PROFILE_EDIT_FAIL:
            return {
                ...state,
                editingRecruiterProfile: false,
                recruiterProfileEditError: true,
                serverMsg: action.msg,
                recruiterActionState: RecruiterConstants.RECRUITER_PROFILE_EDIT_FAIL
            };
        case RecruiterConstants.RECRUITER_SWIPING:
            return {
                ...state,
                recruiterSwiping: true,
                recruiterActionState: RecruiterConstants.RECRUITER_SWIPING
            };
        case RecruiterConstants.RECRUITER_SWIPE_RIGHT:
            return {
                ...state,
                recruiterSwiping: false,
                recruiterSwipingError: false,
                prevSwipeDirection: 'r',
                prevSwipeId: action.swipedStudent._id,
                prevSwipeStudent: action.swipedStudent,
                serverMsg: action.msg,
                recruiterActionState: RecruiterConstants.RECRUITER_SWIPE_RIGHT
            };
        case RecruiterConstants.RECRUITER_SWIPE_LEFT:
            return {
                ...state,
                recruiterSwipingError: false,
                recruiterSwiping: false,
                prevSwipeDirection: 'l',
                prevSwipeId: action.swipedStudent._id,
                prevSwipeStudent: action.swipedStudent,
                serverMsg: action.msg,
                recruiterActionState: RecruiterConstants.RECRUITER_SWIPE_LEFT
            };
        case RecruiterConstants.RECRUITER_SWIPE_FAIL:
            return {
                ...state,
                recruiterSwipingError: true,
                recruiterSwiping: false,
                serverMsg: action.msg,
                recruiterActionState: RecruiterConstants.RECRUITER_SWIPE_FAIL
            };
        case RecruiterConstants.GETTING_RECRUITER_PROFILE:
            return {
                ...state,
                recruiterActionState: action.type,
                gettingSingleRecruiter: true
            };
        case RecruiterConstants.GET_RECRUITER_PROFILE_SUCCESS:
            return {
                ...state,
                recruiterActionState: action.type,
                serverMsg: action.msg,
                gettingSingleRecruiter: false,
                gettingSingleRecruiterError: false,
                singleRecruiterProfile: action.recruiterProfile
            };
        case RecruiterConstants.GET_RECRUITER_PROFILE_FAIL:
            return {
                ...state,
                recruiterActionState: action.type,
                serverMsg: action.msg,
                gettingSingleRecruiterError: true,
                gettingSingleRecruiter: false,
                singleRecruiterProfile: null
            };
        case RecruiterConstants.GETTING_RECRUITERS:
            return {
                ...state,
                recruiterActionState: action.type,
                isLoadingRecruiters: true
            };
        case RecruiterConstants.GETTING_RECRUITERS_SUCCESS:
            return {
                ...state,
                recruiterActionState: action.type,
                isLoadingRecruiters: false,
                recruiters: [...state.recruiters, ...action.recruiterList],
                recruitersLoaded: true,
                serverMsg: action.msg,
                loadingRecruitersError: false
            };
        case RecruiterConstants.GETTING_RECRUITERS_FAIL:
            return {
                ...state,
                recruiterActionState: action.type,
                isLoadingRecruiters: false,
                recruitersLoaded: false,
                serverMsg: action.msg,
                loadingRecruitersError: true
            };
        default:
            return state;
    }
}
export default recruiter;