import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'
import CourseDetails from '../components/CourseDetails'

function mapStateToProps(state, ownProps) {
	const courseId = ownProps.courseId;
	const course = state.courses.coursesById[courseId];
	const participants = state.courses.participantsById[courseId] || []

	return { course, courseId, participants };
}

const CourseDetailsContainer = () => {
	const { courseId } = useParams();
	const { course, participants } = useSelector((state) => mapStateToProps(state, { courseId }));

	return <CourseDetails 
		course={course} 
		participants={participants}
		key={course == null ? null : course.id} />;
};

export default CourseDetailsContainer;