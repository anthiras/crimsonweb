import { get, post } from '../components/Api'
import Auth from '../components/Auth'

export const REQUEST_COURSES = 'REQUEST_COURSES'
export const RECEIVE_COURSES = 'RECEIVE_COURSES'
export const INVALIDATE_COURSES = 'INVALIDATE_COURSES'
export const SET_PARTICIPATION_STATUS = 'SET_PARTICIPATION_STATUS'
export const TOGGLE_SIGNUP_MODAL = 'TOGGLE_SIGNUP_MODAL'
export const SIGNUP_SUBMIT = 'SIGNUP_SUBMIT'
//export const SIGNUP_SUBMIT_SUCCESS = 'SIGNUP_SUBMIT_SUCCESS'
export const SIGNUP_SUBMIT_ERROR = 'SIGNUP_SUBMIT_ERROR'
export const SIGNUP_CANCEL = 'SIGNUP_CANCEL'

export const invalidateCourses = () => ({
	type: INVALIDATE_COURSES
})

export const requestCourses = () => ({
	type: REQUEST_COURSES
})

export const receiveCourses = (json) => ({
	type: RECEIVE_COURSES,
	courses: json,
	receivedAt: Date.now()
})

export const setParticipationStatus = (courseId, status) => ({
	type: SET_PARTICIPATION_STATUS,
	courseId: courseId,
	status: status
})

const fetchCourses = () => (dispatch) => {
	dispatch(requestCourses())
	return get('/v1/courses?include[]=instructors&endsAfter=now')
		.then(courses => {
    		dispatch(receiveCourses(courses))
    	});
}

function shouldFetchCourses(state) {
  const courses = state.courses
  if (!courses) {
    return true
  } else if (courses.isFetching) {
    return false
  } else {
    return courses.didInvalidate
  }
}

export function fetchCoursesIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchCourses(getState())) {
      return dispatch(fetchCourses())
    }
  }
}

const toggleSignupModalAction = (courseId, show) => ({
	type: TOGGLE_SIGNUP_MODAL,
	courseId: courseId,
	show: show,
})

export const toggleSignupModal = (courseId, show) => {
	let auth = new Auth();
	if (show && !auth.isAuthenticated()) {
		auth.login();
		return;
	}
	return toggleSignupModalAction(courseId, show)
}

const signupSubmit = (courseId, signUpDetails) => ({
	type: SIGNUP_SUBMIT,
	signUpDetails: signUpDetails
})

const signupSubmitError = courseId => ({
	type: SIGNUP_SUBMIT_ERROR,
	courseId: courseId
})

export const signup = (courseId, signUpDetails) => dispatch => {
	dispatch(signupSubmit(courseId, signUpDetails))
    post('/v1/courses/' + courseId + '/signUp', signUpDetails)
    	.then(({status}) => dispatch(setParticipationStatus(courseId, status)))
        .catch(() => dispatch(signupSubmitError(courseId)));
}

const cancelSignupAction = courseId => ({
	type: SIGNUP_CANCEL,
	courseId: courseId
})

export const cancelSignup = courseId => dispatch => {
	dispatch(cancelSignupAction(courseId))
    post('/v1/courses/' + courseId + '/cancelSignUp')
    	.then(({status}) => dispatch(setParticipationStatus(courseId, status)));
}