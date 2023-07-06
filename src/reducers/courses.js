import { combineReducers } from 'redux'
import { createSelector } from '@reduxjs/toolkit';
import {
  REQUEST_COURSES, RECEIVE_COURSES, INVALIDATE_COURSES, 
  TOGGLE_SIGNUP_MODAL, 
  FETCH_COURSE, FETCH_COURSE_SUCCESS, FETCH_COURSE_ERROR, 
  SAVE_COURSE, SAVE_COURSE_SUCCESS, SAVE_COURSE_ERROR, EDIT_COURSE_FIELD,
  DELETE_COURSE_SUCCESS,
  FETCH_COURSE_PARTICIPANTS_SUCCESS,
  SUBMIT_PARTICIPATION, SUBMIT_PARTICIPATION_SUCCESS, SUBMIT_PARTICIPATION_ERROR,
  SEND_NOTIFICATION, SEND_NOTIFICATION_SUCCESS, SEND_NOTIFICATION_ERROR, EDIT_NOTIFICATION
} from '../actions/courses'
import { resolveUiState } from '../shared/uiState'
import { parseLocalDate, addWeeks, yearAndWeek } from '../shared/DateUtils';

const mapCourse = (course) => {
    const startsAtDate = parseLocalDate(course.startsAt);
    const endsAtDate = parseLocalDate(course.endsAt);

    const yearWeeks = Array(course.weeks).keys().map(i => yearAndWeek(addWeeks(startsAtDate, i)));

    return { 
        ...course,
        startsAtDate,
        endsAtDate,
        yearWeeks,
        weekday: ((startsAtDate.getDay()-1)+7)%7,
    }
}

function course(state, action) {
    switch (action.type) {
        case SUBMIT_PARTICIPATION_SUCCESS:
            if (!action.isCurrentUser)
                return state;
            return Object.assign({}, state, {
                myParticipation: action.response,
                signupError: false,
                signupProcessing: false,
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
                signupProcessing: true,
            })
        case SUBMIT_PARTICIPATION_ERROR:
            if (!action.isCurrentUser)
                return state
            return Object.assign({}, state, {
                signupError: true,
                signupProcessing: false,
                showSignupModal: true
            })
        case FETCH_COURSE_SUCCESS:
            return Object.assign({}, mapCourse(state), action.response)
        case SEND_NOTIFICATION:
            // fall through
        case SEND_NOTIFICATION_SUCCESS:
            // fall through
        case SEND_NOTIFICATION_ERROR:
            return Object.assign({}, state, {
                notificationUiState: resolveUiState(action.type)
            })
        case EDIT_NOTIFICATION:
            return Object.assign({}, state, {
                notificationUiState: null,
                notificationMessage: action.message
            })
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

const courseListByPage = list => (state = {}, action) => {
    switch (action.type) {
        case RECEIVE_COURSES:
            if (list !== action.list)
                return state;
            return Object.assign({}, state, {
                [action.page]: action.response.data.map(x => x.id)
            })
        default:
            return state;
    }
}

const emptyCourseList = { pages: {}, isFetching: false, links: {} };

const courseList = list => (state = emptyCourseList, action) => {
    switch (action.type) {
        case REQUEST_COURSES:
            if (list !== action.list)
                return state;
            return Object.assign({}, state, {
                isFetching: true
            })
        case RECEIVE_COURSES:
            if (list !== action.list)
                return state;
            return Object.assign({}, state, {
                pages: courseListByPage(list)(state.pages, action),
                lastPage: action.response.meta.last_page,
                isFetching: false,
                links: action.response.links
            })
        case INVALIDATE_COURSES:
            // fall through
        case SAVE_COURSE_SUCCESS:
            // fall through
        case DELETE_COURSE_SUCCESS:
            return emptyCourseList;
        default:
            return state;
    }
}

function coursesById(state = {}, action) {
    switch (action.type) {
        case RECEIVE_COURSES:
            const objectsById = Object.fromEntries(
                action.response.data.map((obj) => [obj.id, obj])
            );
            return Object.assign({}, state, objectsById);
        case SUBMIT_PARTICIPATION_SUCCESS:
            // fall through
        case TOGGLE_SIGNUP_MODAL:
            // fall through
        case SUBMIT_PARTICIPATION:
            // fall through
        case SUBMIT_PARTICIPATION_ERROR:
            // fall through
        case SEND_NOTIFICATION:
            // fall through
        case SEND_NOTIFICATION_SUCCESS:
            // fall through
        case SEND_NOTIFICATION_ERROR:
            // fall through
        case EDIT_NOTIFICATION:
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
        case SAVE_COURSE_SUCCESS:
            return null;
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
        case SAVE_COURSE_SUCCESS:
            // fall through
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
    myCourses: courseList('mine'),
    courseEditor,
    participantsById })

export const selectCoursesById = (state) => state.courses.coursesById;
export const selectParticipantsById = (state) => state.courses.participantsById;

export const selectCourse = (state, id) => state.courses.coursesById[id];
export const selectParticipants = (state, id) => state.courses.participantsById[id];

export const selectCurrentCourses = (state) => state.courses.currentCourses;
export const selectArchivedCourses = (state) => state.courses.archivedCourses;
export const selectMyCourses = (state) => state.courses.myCourses;

export const selectCourseList = createSelector(
    [selectCurrentCourses, selectArchivedCourses, selectMyCourses, (_s, list) => list],
    (currentCourses, archivedCourses, myCourses, list) => {
        if (list === 'current') return currentCourses;
        if (list === 'archive') return archivedCourses;
        if (list === 'mine') return myCourses;
        return undefined;
    },
);
