import { StudentConstants } from '../constants';

const initialState = {
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

function student(state = initialState, action) {
    switch(action.type) {
        case StudentConstants.EDITING_STUDENT_PROFILE:
            return {
                ...state,
                editingStudentProfile: true,
                studentActionState: StudentConstants.EDITING_STUDENT_PROFILE
            };
        case StudentConstants.STUDENT_PROFILE_EDIT_SUCCESS:
            return {
                ...state,
                editingStudentProfile: false,
                studentActionState: StudentConstants.STUDENT_PROFILE_EDIT_SUCCESS,
                serverMsg: action.msg,
                studentEditingError: false,
                studentUser: action.user,
                curUserIsStudent: true,
                basicSuccessStud: action.isBasic && action.isBasic === true ? true: false
            };
        case StudentConstants.STUDENT_PROFILE_EDIT_FAIL:
            return {
                ...state,
                editingStudentProfile: false,
                studentActionState: StudentConstants.STUDENT_PROFILE_EDIT_FAIL,
                studentEditingError: true,
                serverMsg: action.msg
            };
        case StudentConstants.STUDENT_SWIPING:
            return {
                ...state,
                studentSwiping: true,
                studentActionState: StudentConstants.STUDENT_SWIPING,
            };
        case StudentConstants.STUDENT_SWIPE_RIGHT:
            return {
                ...state,
                studentSwiping: false,
                studentSwipingError: false,
                prevSwipeDirection: 'r',
                prevSwipeId: action.swipedJob._id,
                prevSwipeJob: action.swipedJob,
                serverMsg: action.msg,
                studentActionState: StudentConstants.STUDENT_SWIPE_RIGHT
            };
        case StudentConstants.STUDENT_SWIPE_LEFT:
            return {
                ...state,
                studentSwiping: false,
                studentSwipingError: false,
                prevSwipeDirection: 'l',
                prevSwipeId: action.swipedJob._id,
                prevSwipeJob: action.swipedJob,
                serverMsg: action.msg,
                studentActionState: StudentConstants.STUDENT_SWIPE_LEFT
            };
        case StudentConstants.STUDENT_SWIPE_FAIL:
            return {
                ...state,
                studentSwiping: false,
                studentSwipingError: true,
                serverMsg: action.msg,
                studentActionState: StudentConstants.STUDENT_SWIPE_FAIL,

            };
        case StudentConstants.GETTING_STUDENT_PROFILE:
            return {
                ...state,
                studentActionState: action.type,
                gettingSingleStudent: true
            };
        case StudentConstants.GETTING_STUDENT_PROFILE_SUCCESS:
            return {
                ...state,
                studentActionState: action.type,
                gettingSingleStudent: false,
                singleStudentProfile: action.studenProfile,
                serverMsg: action.msg
            };
        case StudentConstants.GETTING_STUDENT_PROFILE_FAIL:
            return {
                ...state,
                studentActionState: action.type,
                gettingSingleStudent: false,
                gettingSingleStudentError: true,
                serverMsg: action.msg
            }
        default:
            return state;
    }
}
export default student;