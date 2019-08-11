import { get, post, put, del } from '../shared/Api'
import Auth from '../shared/Auth'
import history from '../shared/History'

export const REQUEST_COURSES = 'REQUEST_COURSES'
export const REQUEST_COURSES_ERROR = 'REQUEST_COURSES_ERROR'
export const RECEIVE_COURSES = 'RECEIVE_COURSES'
export const INVALIDATE_COURSES = 'INVALIDATE_COURSES'
export const TOGGLE_SIGNUP_MODAL = 'TOGGLE_SIGNUP_MODAL'
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
export const FETCH_COURSE_PARTICIPANTS = 'FETCH_COURSE_PARTICIPANTS'
export const FETCH_COURSE_PARTICIPANTS_SUCCESS = 'FETCH_COURSE_PARTICIPANTS_SUCCESS'
export const FETCH_COURSE_PARTICIPANTS_ERROR = 'FETCH_COURSE_PARTICIPANTS_ERROR'
export const SUBMIT_PARTICIPATION = 'SUBMIT_PARTICIPATION'
export const SUBMIT_PARTICIPATION_SUCCESS = 'SUBMIT_PARTICIPATION_SUCCESS'
export const SUBMIT_PARTICIPATION_ERROR = 'SUBMIT_PARTICIPATION_ERROR'
export const SEND_NOTIFICATION = 'SEND_NOTIFICATION'
export const SEND_NOTIFICATION_SUCCESS = 'SEND_NOTIFICATION_SUCCESS'
export const SEND_NOTIFICATION_ERROR = 'SEND_NOTIFICATION_ERROR'
export const EDIT_NOTIFICATION = 'EDIT_NOTIFICATION'

export const fetchCourses = (list, page) => ({
	types: [REQUEST_COURSES, RECEIVE_COURSES, REQUEST_COURSES_ERROR],
	shouldCallApi: state => {
		return list === 'current' ? !state.courses.currentCourses.pages[page]
			: list === 'archive' ? !state.courses.archivedCourses.pages[page]
			: false;
	},
	callApi: list === 'current' ? () => get('/v1/courses?include[]=instructors&endsAfter=now&page='+page)
		: list === 'archive' ? () => get('/v1/courses?include[]=instructors&endsBefore=now&page='+page)
		: () => {},
	payload: { list, page }
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
		return toggleSignupModalAction(courseId, false);
	}
	return toggleSignupModalAction(courseId, show)
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

export const fetchCourseParticipants = courseId => ({
	types: [FETCH_COURSE_PARTICIPANTS, FETCH_COURSE_PARTICIPANTS_SUCCESS, FETCH_COURSE_PARTICIPANTS_ERROR],
	shouldCallApi: state => !state.courses.participantsById[courseId],
	callApi: () => get('/v1/courses/'+courseId+'/participants'),
	payload: { courseId }
})

export const signup = (courseId, signUpDetails) => ({
	types: [SUBMIT_PARTICIPATION, SUBMIT_PARTICIPATION_SUCCESS, SUBMIT_PARTICIPATION_ERROR],
	callApi: () => post('/v1/courses/' + courseId + '/signUp', signUpDetails),
	payload: { courseId, signUpDetails, isCurrentUser: true }
})

export const cancelSignup = (courseId) => ({
	types: [SUBMIT_PARTICIPATION, SUBMIT_PARTICIPATION_SUCCESS, SUBMIT_PARTICIPATION_ERROR],
	callApi: () => post('/v1/courses/' + courseId + '/cancelSignUp'),
	payload: { courseId, isCurrentUser: true }
})

export const confirmCourseParticipant = (courseId, userId) => ({
	types: [SUBMIT_PARTICIPATION, SUBMIT_PARTICIPATION_SUCCESS, SUBMIT_PARTICIPATION_ERROR],
	callApi: () => post('/v1/courses/'+courseId+'/participants/'+userId+'/confirm'),
	payload: { courseId, userId }
})

export const cancelCourseParticipant = (courseId, userId) => ({
	types: [SUBMIT_PARTICIPATION, SUBMIT_PARTICIPATION_SUCCESS, SUBMIT_PARTICIPATION_ERROR],
	callApi: () => post('/v1/courses/'+courseId+'/participants/'+userId+'/cancel'),
	payload: { courseId, userId }
})

export const setParticipantAmountPaid = (courseId, userId, amountPaid) => ({
	types: [SUBMIT_PARTICIPATION, SUBMIT_PARTICIPATION_SUCCESS, SUBMIT_PARTICIPATION_ERROR],
	callApi: () => post('/v1/courses/'+courseId+'/participants/'+userId+'/setAmountPaid', { amountPaid: amountPaid }),
	payload: { courseId, userId }
})

export const sendNotification = (courseId, message) => ({
	types: [SEND_NOTIFICATION, SEND_NOTIFICATION_SUCCESS, SEND_NOTIFICATION_ERROR],
	callApi: () => post('/v1/courses/'+courseId+'/notify', { message: message }),
	payload: { courseId, message }
})

export const editNotification = (courseId, message) => ({
	type: EDIT_NOTIFICATION,
	courseId: courseId,
	message: message 
})