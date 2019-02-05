import { combineReducers } from 'redux'
import {
  REQUEST_COURSES, RECEIVE_COURSES, INVALIDATE_COURSES, SET_PARTICIPATION_STATUS,
  TOGGLE_SIGNUP_MODAL, SIGNUP_SUBMIT, SIGNUP_SUBMIT_ERROR, 
  FETCH_COURSE, FETCH_COURSE_SUCCESS, FETCH_COURSE_ERROR, 
  SAVE_COURSE, SAVE_COURSE_SUCCESS, SAVE_COURSE_ERROR, EDIT_COURSE_FIELD,
  DELETE_COURSE_SUCCESS
} from '../actions/courses'
import { resolveUiState } from '../shared/uiState'

function course(state, action) {
    switch (action.type) {
        case SET_PARTICIPATION_STATUS:
            return Object.assign({}, state, {
                myParticipation: { participation: { status: action.status } },
                signupError: false,
                showSignupModal: false
            })
        case TOGGLE_SIGNUP_MODAL:
            return Object.assign({}, state, {
                showSignupModal: action.show
            })
        case SIGNUP_SUBMIT:
            return Object.assign({}, state, {
                signupError: false,
            })
        case SIGNUP_SUBMIT_ERROR:
            return Object.assign({}, state, {
                signupError: true,
                showSignupModal: true
            })
        case FETCH_COURSE_SUCCESS:
            return Object.assign({}, state, action.response)
        default:
            return state;
    }
}

function courseEditor(state = {
    uiState: null
}, action) {
    switch (action.type) {
        case EDIT_COURSE_FIELD:
            // fall through
        case SAVE_COURSE:
            // fall through
        case SAVE_COURSE_SUCCESS:
            // fall through
        case SAVE_COURSE_ERROR:
            // fall through
        case FETCH_COURSE:
            // fall through
        case FETCH_COURSE_SUCCESS:
            // fall through
        case FETCH_COURSE_ERROR:
            return Object.assign({}, state, {
                uiState: resolveUiState(action.type)
            })
        default:
            return state;
    }
}

const courseList = list => (state = {
    items: [],
    isFetching: false,
    didInvalidate: true
}, action) => {
    switch (action.type) {
        case INVALIDATE_COURSES:
            // fall through
        case SAVE_COURSE_SUCCESS:
            return Object.assign({}, state, {
                didInvalidate: true
            })
        case REQUEST_COURSES:
            if (list !== action.list)
                return state;
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            })
        case RECEIVE_COURSES:
            if (list !== action.list)
                return state;
            return Object.assign({}, state, {
                items: action.response.map(x => x.id),
                isFetching: false,
                didInvalidate: false
            })
        case DELETE_COURSE_SUCCESS:
            return Object.assign({}, state, {
                items: state.items.filter(id => id !== action.courseId)
            })
        default:
            return state;
    }
}

function coursesById(state = {}, action) {
    switch (action.type) {
        case RECEIVE_COURSES:
            return action.response.reduce((state, obj) => {
                state[obj.id] = obj;
                return state;
            }, state);
        case SET_PARTICIPATION_STATUS:
            // fall through
        case TOGGLE_SIGNUP_MODAL:
            // fall through
        case SIGNUP_SUBMIT:
            // fall through
        case SIGNUP_SUBMIT_ERROR:
            // fall through
        case FETCH_COURSE_SUCCESS:
            const courseId = action.courseId || (action.response != null ? action.response.id : null);
            return Object.assign({}, state, {
                [courseId]: course(state[courseId], action)
            })
        case SAVE_COURSE_SUCCESS:
            // fall through
        case DELETE_COURSE_SUCCESS:
            if (action.courseId) {
                return Object.assign({}, state, {
                    [action.courseId]: null
                })
            }
            return state;
        default:
            return state
    }
}

export const courses = combineReducers({ 
    coursesById, 
    currentCourses: courseList('current'), 
    archivedCourses: courseList('archive'),
    courseEditor })