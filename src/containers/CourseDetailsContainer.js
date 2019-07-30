import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  fetchCourse, fetchCourseParticipants, confirmCourseParticipant, 
  cancelCourseParticipant, setParticipantAmountPaid,
  sendNotification, editNotification
} from '../actions/courses'
import CourseDetails from '../components/CourseDetails'

class CourseDetailsContainer extends Component
{
	componentDidMount() {
		this.props.fetchCourse(this.props.courseId)
		this.props.fetchCourseParticipants(this.props.courseId)
	}

	componentDidUpdate(prevProps) {
		if (prevProps.courseId !== this.props.courseId) {
			this.props.fetchCourse(this.props.courseId)
			this.props.fetchCourseParticipants(this.props.courseId)
		}
	}

	render() {
		const { course, participants, fetchCourse, confirmCourseParticipant, 
			cancelCourseParticipant, setParticipantAmountPaid, 
			sendNotification, editNotification } = this.props;

		return (<CourseDetails 
			course={course} 
			participants={participants}
			key={course == null ? null : course.id} 
			fetchCourse={fetchCourse}
			confirmCourseParticipant={confirmCourseParticipant}
			cancelCourseParticipant={cancelCourseParticipant}
			setParticipantAmountPaid={setParticipantAmountPaid}
			sendNotification={sendNotification}
			editNotification={editNotification} />);
	}
}

function mapStateToProps(state, ownProps) {
	const courseId = ownProps.match.params.courseId;
	const course = state.courses.coursesById[courseId];
	const participants = state.courses.participantsById[courseId] || []

	return { course, courseId, participants };
}

const actionCreators = {
	fetchCourse, fetchCourseParticipants, confirmCourseParticipant, 
	cancelCourseParticipant, setParticipantAmountPaid, sendNotification, 
	editNotification
}

export default connect(mapStateToProps, actionCreators)(CourseDetailsContainer);