import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  fetchCourse, saveCourse, editCourseField, deleteCourse
} from '../actions/courses'
import CourseEditor from '../components/CourseEditor'
import { Loading } from '../components/Utilities';

class CourseEditorContainer extends Component
{
	componentDidMount() {
		if (this.props.courseId) {
			this.props.fetchCourse(this.props.courseId)
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.courseId !== this.props.courseId && this.props.courseId) {
			this.props.fetchCourse(this.props.courseId)
		}
	}

	render() {
		const { courseId, course, fetchCourse, saveCourse, editCourseField, deleteCourse, uiState } = this.props;
		if (courseId != null && course == null)
			return <Loading />;
		return (<CourseEditor 
			course={course} 
			key={course == null ? null : course.id} 
			fetchCourse={fetchCourse}
			saveCourse={saveCourse}
			editCourseField={editCourseField}
			deleteCourse={deleteCourse}
			uiState={uiState} />);
	}
}

function mapStateToProps(state, ownProps) {
	const courseId = ownProps.match.params.courseId;
	const course = courseId == null ? null : state.courses.coursesById[courseId];

	return { 
		course: course, 
		courseId: courseId,
		uiState: state.courses.courseEditor.uiState
	};
}

const actionCreators = {
	fetchCourse, saveCourse, editCourseField, deleteCourse
}

export default connect(mapStateToProps, actionCreators)(CourseEditorContainer);