import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { selectCourse, selectParticipants } from '../reducers/courses';
import CourseDetails from '../components/CourseDetails'
import useCourseActions from '../actions/courses';
import { Loading } from '../components/Utilities';

const CourseDetailsContainer = () => {
	const { courseId } = useParams();
	const course = useSelector((state) => selectCourse(state, courseId));
	const participants = useSelector((state) => selectParticipants(state, courseId));

	const { fetchCourse, fetchCourseParticipants } = useCourseActions();

	useEffect(() => {
		fetchCourse(courseId);
		fetchCourseParticipants(courseId);
	}, [courseId]);

	if (courseId != null && course == null)
		return <Loading />;

	return <CourseDetails 
		course={course} 
		participants={participants || []}
		key={course == null ? null : course.id} />;
};

export default CourseDetailsContainer;