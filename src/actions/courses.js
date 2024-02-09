import { useAuth0 } from '@auth0/auth0-react'
import useApi from '../shared/Api'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'

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

const toggleSignupModalAction = (courseId, show) => ({
	type: TOGGLE_SIGNUP_MODAL,
	courseId: courseId,
	show: show,
})

const useCourseActions = () => {
	const { isAuthenticated, loginWithRedirect } = useAuth0();
	const { get, post, del, put } = useApi();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	return {
		fetchCourses: (list, page) => dispatch({
			types: [REQUEST_COURSES, RECEIVE_COURSES, REQUEST_COURSES_ERROR],
			shouldCallApi: state => {
				return list === 'current' ? !state.courses.currentCourses.pages[page]
					: list === 'events' ? !state.courses.currentEvents.pages[page]
					: list === 'archive' ? !state.courses.archivedCourses.pages[page]
					: list === 'mine' ? !state.courses.myCourses.pages[page]
					: false;
			},
			callApi: list === 'current' ? () => get('/v1/courses?include[]=instructors&endsAfter=now&minWeeks=2&page='+page)
				: list === 'events' ? () => get('/v1/courses?include[]=instructors&endsAfter=now&maxWeeks=1&page='+page)
				: list === 'archive' ? () => get('/v1/courses?include[]=instructors&endsBefore=now&direction=desc&page='+page)
				: list === 'mine' ? () => get('/v1/courses?include[]=instructors&endsAfter=now&mine=1&page='+page)
				: () => {},
			payload: { list, page }
		}),

		toggleSignupModal: (courseId, show) => {
			if (show && !isAuthenticated) {
				loginWithRedirect();
				dispatch(toggleSignupModalAction(courseId, false));
			}
			dispatch(toggleSignupModalAction(courseId, show))
		},

		fetchCourse: courseId => dispatch({
			types: [FETCH_COURSE, FETCH_COURSE_SUCCESS, FETCH_COURSE_ERROR],
			shouldCallApi: state => !state.courses.coursesById[courseId],
			callApi: () => get('/v1/courses/'+courseId),
			payload: { courseId }
		}),

		saveCourse: course => dispatch({
			types: [SAVE_COURSE, SAVE_COURSE_SUCCESS, SAVE_COURSE_ERROR],
			callApi: course.id
				? () => put('/v1/courses/'+course.id, course)
				: () => post('/v1/courses', course),
			payload: { course, courseId: course.id },
			onSuccess: course.id
				? () => navigate('/courses/'+course.id)
				: response => navigate('/courses/'+response.id)
		}),

		editCourseField: courseId => dispatch({
			type: EDIT_COURSE_FIELD,
			payload: { courseId }
		}),

		deleteCourse: courseId => dispatch({
			types: [DELETE_COURSE, DELETE_COURSE_SUCCESS, DELETE_COURSE_ERROR],
			callApi: () => del('/v1/courses/'+courseId),
			payload: { courseId },
			onSuccess: () => navigate('/courses')
		}),

		fetchCourseParticipants: courseId => dispatch({
			types: [FETCH_COURSE_PARTICIPANTS, FETCH_COURSE_PARTICIPANTS_SUCCESS, FETCH_COURSE_PARTICIPANTS_ERROR],
			shouldCallApi: state => !state.courses.participantsById[courseId],
			callApi: () => get('/v1/courses/'+courseId+'/participants'),
			payload: { courseId }
		}),

		signup: (courseId, signUpDetails) => dispatch({
			types: [SUBMIT_PARTICIPATION, SUBMIT_PARTICIPATION_SUCCESS, SUBMIT_PARTICIPATION_ERROR],
			callApi: () => post('/v1/courses/' + courseId + '/signUp', signUpDetails),
			payload: { courseId, signUpDetails, isCurrentUser: true }
		}),

		cancelSignup: (courseId) => dispatch({
			types: [SUBMIT_PARTICIPATION, SUBMIT_PARTICIPATION_SUCCESS, SUBMIT_PARTICIPATION_ERROR],
			callApi: () => post('/v1/courses/' + courseId + '/cancelSignUp'),
			payload: { courseId, isCurrentUser: true }
		}),

		confirmCourseParticipant: (courseId, userId) => dispatch({
			types: [SUBMIT_PARTICIPATION, SUBMIT_PARTICIPATION_SUCCESS, SUBMIT_PARTICIPATION_ERROR],
			callApi: () => post('/v1/courses/'+courseId+'/participants/'+userId+'/confirm'),
			payload: { courseId, userId }
		}),

		cancelCourseParticipant: (courseId, userId) => dispatch({
			types: [SUBMIT_PARTICIPATION, SUBMIT_PARTICIPATION_SUCCESS, SUBMIT_PARTICIPATION_ERROR],
			callApi: () => post('/v1/courses/'+courseId+'/participants/'+userId+'/cancel'),
			payload: { courseId, userId }
		}),

		setParticipantAmountPaid: (courseId, userId, amountPaid) => dispatch({
			types: [SUBMIT_PARTICIPATION, SUBMIT_PARTICIPATION_SUCCESS, SUBMIT_PARTICIPATION_ERROR],
			callApi: () => post('/v1/courses/'+courseId+'/participants/'+userId+'/setAmountPaid', { amountPaid: amountPaid }),
			payload: { courseId, userId }
		}),

		sendNotification: (courseId, message) => dispatch({
			types: [SEND_NOTIFICATION, SEND_NOTIFICATION_SUCCESS, SEND_NOTIFICATION_ERROR],
			callApi: () => post('/v1/courses/'+courseId+'/notify', { message: message }),
			payload: { courseId, message }
		}),

		editNotification: (courseId, message) => dispatch({
			type: EDIT_NOTIFICATION,
			courseId: courseId,
			message: message 
		}),
	};
}

export default useCourseActions;
