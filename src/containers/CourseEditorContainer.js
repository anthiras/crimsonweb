import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'
import useCourseActions from '../actions/courses'
import { selectCourse } from '../reducers/courses';
import CourseEditor from '../components/CourseEditor'
import { Loading } from '../components/Utilities';

const CourseEditorContainer = () => {
	const { courseId } = useParams();
	const course = useSelector((state) => selectCourse(state, courseId));
	const uiState = useSelector((state) => state.courses.courseEditor.uiState);

	const { fetchCourse } = useCourseActions();

	useEffect(() => {
		fetchCourse(courseId);
	}, [courseId]);

	if (courseId != null && course == null)
		return <Loading />;

	return <CourseEditor 
		course={course} 
		uiState={uiState}
		key={course == null ? null : course.id} />;
};

export default CourseEditorContainer;