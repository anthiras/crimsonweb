import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { selectCourse, selectParticipants } from '../reducers/courses';
import CourseDetails from '../components/CourseDetails'
import useCourseActions from '../actions/courses';
import useUserActions from '../actions/users';
import { Loading } from '../components/Utilities';
import usePermissions from '../hooks/usePermissions';

const CourseDetailsContainer = () => {
	const { courseId } = useParams();
	const course = useSelector((state) => selectCourse(state, courseId));
	const participants = useSelector((state) => selectParticipants(state, courseId));
	const permissions = usePermissions();
	const profile = useSelector((state) => state.profile);

	const { fetchCourse, fetchCourseParticipants } = useCourseActions();
	const { fetchProfileIfNeeded } = useUserActions();
	
	useEffect(() => {
		fetchCourse(courseId);
		if (permissions['courses:manageParticipants'])
			fetchCourseParticipants(courseId);
		fetchProfileIfNeeded();
	}, [courseId, permissions]);

	if (courseId != null && course == null)
		return <Loading />;

	return <CourseDetails 
		course={course} 
		participants={participants}
		profile={profile}
		key={course == null ? null : course.id} />;
};

export default CourseDetailsContainer;