import React from 'react';
import CourseListItem from '../containers/CourseListItem'
import { withTranslation } from 'react-i18next';
import { Pagination } from './Utilities';
import moment from 'moment';

const groupCoursesByWeek = courses => {
	let coursesByWeek = [];
	let currentKey = null;
	for (let i = 0; i < courses.length; i++) {
		let course = courses[i];
		let startsAt = moment(new Date(course.startsAt));
		let week = startsAt.week();
		let key = startsAt.year() + '-' + startsAt.week();
		if (key !== currentKey) {
			coursesByWeek.push({ key: key, week: week, courses: []});
			currentKey = key;
		}
		coursesByWeek[coursesByWeek.length-1].courses.push(course);
	}
	return coursesByWeek;
}

const CourseCards = ({ t, courses, page, lastPage, list }) => {
	if (courses.length === 0)
		return (<p className="lead text-center text-muted my-5">{t('courses:noCoursesFound')}</p>);

	const coursesByWeek = groupCoursesByWeek(courses);

	return (
		<div className="row">
			<div className="col-sm">
				{coursesByWeek.map(courseWeek => 
					<React.Fragment key={courseWeek.key}>
						<h4>{t('common:week')} {courseWeek.week}</h4>
						    <div className="card-columns">
						        {courseWeek.courses.map(course =>
						            <CourseListItem course={course} key={course.id} />
						        )}
						    </div>
			    	</React.Fragment>
			    )}
			    <Pagination page={page} lastPage={lastPage} urlForPage={(page) => '/courses/'+list+'/'+page} />
		    </div>
	    </div>
	);
}

export default withTranslation()(CourseCards);