import { get, post, put, del } from '../components/Api'
import Auth from '../components/Auth'
import history from '../components/History'

export const REQUEST_COURSES = 'REQUEST_COURSES'
export const REQUEST_COURSES_ERROR = 'REQUEST_COURSES_ERROR'
export const RECEIVE_COURSES = 'RECEIVE_COURSES'
export const INVALIDATE_COURSES = 'INVALIDATE_COURSES'
export const SET_PARTICIPATION_STATUS = 'SET_PARTICIPATION_STATUS'
export const TOGGLE_SIGNUP_MODAL = 'TOGGLE_SIGNUP_MODAL'
export const SIGNUP_SUBMIT = 'SIGNUP_SUBMIT'
//export const SIGNUP_SUBMIT_SUCCESS = 'SIGNUP_SUBMIT_SUCCESS'
export const SIGNUP_SUBMIT_ERROR = 'SIGNUP_SUBMIT_ERROR'
export const SIGNUP_CANCEL = 'SIGNUP_CANCEL'
export const FETCH_COURSE = 'FETCH_COURSE'
export const FETCH_COURSE_SUCCESS = 'FETCH_COURSE_SUCCESS'
export const FETCH_COURSE_ERROR = 'FETCH_COURSE_ERROR'
export const SAVE_COURSE = 'SAVE_COURSE'
export const SAVE_COURSE_SUCCESS = 'SAVE_COURSE_SUCCESS'
export const SAVE_COURSE_ERROR = 'SAVE_COURSE_ERROR'
export const EDIT_COURSE_FIELD = 'EDIT_COURSE_FIELD'
export const DELETE_COURSE = 'DELETE_COURSE'
export const DELETE_COURSE_SUCCESS = 'DELETE_COURSE_SUCCESS'
export const DELETE_COURSE_ERROR = 'DELETE_COURSE_ERROR'

export const setParticipationStatus = (courseId, status) => ({
	type: SET_PARTICIPATION_STATUS,
	courseId: courseId,
	status: status
})

function shouldFetchCourses(courses) {
  if (!courses) {
    return true
  } else if (courses.isFetching) {
    return false
  } else {
    return courses.didInvalidate
  }
}

export const fetchCourses = list => ({
	types: [REQUEST_COURSES, RECEIVE_COURSES, REQUEST_COURSES_ERROR],
	shouldCallApi: state => shouldFetchCourses(state.courses.currentCourses),
	callApi: list === 'current' ? () => get('/v1/courses?include[]=instructors&endsAfter=now')
		: list === 'archive' ? () => get('/v1/courses?include[]=instructors&endsBefore=now')
		: () => {},
	payload: { list }
})

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

export const fetchCourse = courseId => ({
	types: [FETCH_COURSE, FETCH_COURSE_SUCCESS, FETCH_COURSE_ERROR],
	shouldCallApi: state => !state.courses.coursesById[courseId],
	callApi: () => get('/v1/courses/'+courseId),
	payload: { courseId }
})

export const saveCourse = course => ({
	types: [SAVE_COURSE, SAVE_COURSE_SUCCESS, SAVE_COURSE_ERROR],
	callApi: course.id
		? () => put('/v1/courses/'+course.id, course)
		: () => post('/v1/courses', course),
	payload: { course, courseId: course.id },
	onSuccess: course.id
		? () => history.push('/courses/'+course.id)
		: response => history.push('/courses/'+response.id)
})

export const editCourseField = courseId => ({
	type: EDIT_COURSE_FIELD,
	payload: { courseId }
})

export const deleteCourse = courseId => ({
	types: [DELETE_COURSE, DELETE_COURSE_SUCCESS, DELETE_COURSE_ERROR],
	callApi: () => del('/v1/courses/'+courseId),
	payload: { courseId },
	onSuccess: () => history.push('/courses')
})