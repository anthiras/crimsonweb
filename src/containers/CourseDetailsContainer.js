import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  fetchCourse
} from '../actions/courses'
import CourseDetails from '../components/CourseDetails'

class CourseDetailsContainer extends Component
{
	componentDidMount() {
		this.props.fetchCourse(this.props.courseId)
	}

	componentDidUpdate(prevProps) {
		if (prevProps.courseId !== this.props.courseId) {
			this.props.fetchCourse(this.props.courseId)
		}
	}

	render() {
		const { course, fetchCourse } = this.props;
		return (<CourseDetails 
			course={course} 
			key={course == null ? null : course.id} 
			fetchCourse={fetchCourse} />);
	}
}

function mapStateToProps(state, ownProps) {
	const courseId = ownProps.match.params.courseId;
	const course = state.courses.coursesById[courseId];

	return { course, courseId };
}

const actionCreators = {
	fetchCourse
}

export default connect(mapStateToProps, actionCreators)(CourseDetailsContainer);