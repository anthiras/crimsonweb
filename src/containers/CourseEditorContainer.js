import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'
import useCourseActions from '../actions/courses'
import CourseEditor from '../components/CourseEditor'
import { Loading } from '../components/Utilities';

function mapStateToProps(state, ownProps) {
	const courseId = ownProps.courseId;
	const course = courseId == null ? null : state.courses.coursesById[courseId];

	return { 
		course: course, 
		courseId: courseId,
		uiState: state.courses.courseEditor.uiState
	};
}

const CourseEditorContainer = () => {
	const { courseId } = useParams();
	const { course, uiState } = useSelector((state) => mapStateToProps(state, { courseId }));

	const { fetchCourse } = useCourseActions();

	useEffect(() => {
		if (courseId) fetchCourse(courseId)
	}, [courseId]);

	if (courseId != null && course == null)
		return <Loading />;

	return <CourseEditor 
		course={course} 
		uiState={uiState}
		key={course == null ? null : course.id} />;
};

export default CourseEditorContainer;