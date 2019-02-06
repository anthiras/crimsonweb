import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  fetchCourse, fetchCourseParticipants
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
		const { course, participants, fetchCourse } = this.props;
		return (<CourseDetails 
			course={course} 
			participants={participants}
			key={course == null ? null : course.id} 
			fetchCourse={fetchCourse} />);
	}
}

function mapStateToProps(state, ownProps) {
	const courseId = ownProps.match.params.courseId;
	const course = state.courses.coursesById[courseId];
	const participants = state.courses.participantsById[courseId] || []

	return { course, courseId, participants };
}

const actionCreators = {
	fetchCourse, fetchCourseParticipants
}

export default connect(mapStateToProps, actionCreators)(CourseDetailsContainer);