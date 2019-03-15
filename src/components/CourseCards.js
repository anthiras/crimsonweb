import React from 'react';
import CourseListItem from '../containers/CourseListItem'
import { withTranslation } from 'react-i18next';

const CourseCards = ({ t, courses }) => {
	if (courses.length === 0)
		return (<p className="lead text-center text-muted my-5">{t('courses:noCoursesFound')}</p>);
	return (
	    <div className="card-columns">
	        {courses.map(course =>
	            <CourseListItem course={course} key={course.id} />
	        )}
	    </div>
	);
}

export default withTranslation()(CourseCards);