import React from 'react';
import CourseListItem from '../containers/CourseListItem'
import { withTranslation } from 'react-i18next';
import { Pagination } from './Utilities';

const CourseCards = ({ t, courses, page, lastPage, list }) => {
	if (courses.length === 0)
		return (<p className="lead text-center text-muted my-5">{t('courses:noCoursesFound')}</p>);

	return (
		<React.Fragment>
		    <div className="card-columns">
		        {courses.map(course =>
		            <CourseListItem course={course} key={course.id} />
		        )}
		    </div>
		    <Pagination page={page} lastPage={lastPage} urlForPage={(page) => '/courses/'+list+'/'+page} />
	    </React.Fragment>
	);
}

export default withTranslation()(CourseCards);