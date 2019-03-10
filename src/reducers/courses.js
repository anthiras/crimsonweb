import { combineReducers } from 'redux'
import {
  REQUEST_COURSES, RECEIVE_COURSES, INVALIDATE_COURSES, 
  TOGGLE_SIGNUP_MODAL, 
  FETCH_COURSE, FETCH_COURSE_SUCCESS, FETCH_COURSE_ERROR, 
  SAVE_COURSE, SAVE_COURSE_SUCCESS, SAVE_COURSE_ERROR, EDIT_COURSE_FIELD,
  DELETE_COURSE_SUCCESS,
  FETCH_COURSE_PARTICIPANTS_SUCCESS,
  SUBMIT_PARTICIPATION, SUBMIT_PARTICIPATION_SUCCESS, SUBMIT_PARTICIPATION_ERROR
} from '../actions/courses'
import { resolveUiState } from '../shared/uiState'

function course(state, action) {
    switch (action.type) {
        case SUBMIT_PARTICIPATION_SUCCESS:
            if (!action.isCurrentUser)
                return state;
            return Object.assign({}, state, {
                myParticipation: action.response,
                signupError: false,
                showSignupModal: false
            })
        case TOGGLE_SIGNUP_MODAL:
            return Object.assign({}, state, {
                showSignupModal: action.show
            })
        case SUBMIT_PARTICIPATION:
            if (!action.isCurrentUser)
                return state
            return Object.assign({}, state, {
                signupError: false,
            })
        case SUBMIT_PARTICIPATION_ERROR:
            if (!action.isCurrentUser)
                return state
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
        case SUBMIT_PARTICIPATION_SUCCESS:
            // fall through
        case TOGGLE_SIGNUP_MODAL:
            // fall through
        case SUBMIT_PARTICIPATION:
            // fall through
        case SUBMIT_PARTICIPATION_ERROR:
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

function courseParticipants(state = [], action) {
    switch (action.type) {
        case FETCH_COURSE_PARTICIPANTS_SUCCESS:
            // fall through
        case SUBMIT_PARTICIPATION_SUCCESS:
            const updatedParticipant = action.response;
            if (state.some(participant => participant.id === updatedParticipant.id))
                return state.map(participant => {
                    if (participant.id === updatedParticipant.id)
                        return updatedParticipant
                    return participant
                })
            else
                return [...state, updatedParticipant]
        default:
            return state
    }
}

function participantsById(state = {}, action) {
    switch (action.type) {
        case FETCH_COURSE_PARTICIPANTS_SUCCESS:
            return Object.assign({}, state, {
               [action.courseId]: action.response
            })
        case SUBMIT_PARTICIPATION_SUCCESS:
            return Object.assign({}, state, {
                [action.courseId]: courseParticipants(state[action.courseId], action)
            })
        default:
            return state
    }
}

export const courses = combineReducers({ 
    coursesById, 
    currentCourses: courseList('current'), 
    archivedCourses: courseList('archive'),
    courseEditor,
    participantsById })