import {
  REQUEST_COURSES, RECEIVE_COURSES, INVALIDATE_COURSES, SET_PARTICIPATION_STATUS,
  TOGGLE_SIGNUP_MODAL, SIGNUP_SUBMIT, SIGNUP_SUBMIT_ERROR, SIGNUP_CANCEL
} from '../actions/courses'

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
        default:
            return state;
    }
}

export function courses(
    state = {
        isFetching: false,
        didInvalidate: true,
        items: []
    }, action) {
    switch (action.type) {
        case INVALIDATE_COURSES:
            return Object.assign({}, state, {
                didInvalidate: true
            })
        case REQUEST_COURSES:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            })
        case RECEIVE_COURSES:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                items: action.courses,
                lastUpdated: action.receivedAt
            })
        case SET_PARTICIPATION_STATUS:
            // fall through
        case TOGGLE_SIGNUP_MODAL:
            // fall through
        case SIGNUP_SUBMIT:
            // fall through
        case SIGNUP_SUBMIT_ERROR:
            return Object.assign({}, state, {
                items: state.items.map((data, index) => {
                    if (data.id === action.courseId) {
                        return course(data, action);
                    }
                    return data
                })})
        case SIGNUP_CANCEL:
            // fall through
        default:
            return state;
    }
}
