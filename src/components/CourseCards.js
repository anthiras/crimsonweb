import React from 'react';
import { withTranslation } from 'react-i18next';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Pagination } from './Utilities';
import { parseLocalDate, weekNumber } from '../shared/DateUtils';
import CourseCard, { CourseCardPlaceholder } from '../components/CourseCard'
import Placeholder from 'react-bootstrap/Placeholder';

const groupCoursesByWeek = courses => {
	let coursesByWeek = [];
	let currentKey = null;
	for (let i = 0; i < courses.length; i++) {
		let course = courses[i];
		let startsAt = parseLocalDate(course.startsAt);
		let week = weekNumber(startsAt)
		let key = startsAt.getFullYear() + '-' + week;
		if (key !== currentKey) {
			coursesByWeek.push({ key: key, week: week, courses: []});
			currentKey = key;
		}
		coursesByWeek[coursesByWeek.length-1].courses.push(course);
	}
	return coursesByWeek;
}

const CourseCardsPlaceholder = () => (
	<React.Fragment>
		<Placeholder as="h4" animation="glow">
			<Placeholder xs={2} />
		</Placeholder>
	<Row>
		<Col sm="4"><CourseCardPlaceholder /></Col>
		<Col sm="4"><CourseCardPlaceholder /></Col>
		<Col sm="4"><CourseCardPlaceholder /></Col>
	</Row>
	<Row>
		<Col sm="4"><CourseCardPlaceholder /></Col>
		<Col sm="4"><CourseCardPlaceholder /></Col>
		<Col sm="4"><CourseCardPlaceholder /></Col>
	</Row>
</React.Fragment>);

const CourseCards = ({ t, courses, page, lastPage, list, isFetching }) => {
	if (isFetching)
		return <CourseCardsPlaceholder />;

	if (courses.length === 0)
		return (<p className="lead text-center text-muted my-5">{t('courses:noCoursesFound')}</p>);

	const coursesByWeek = groupCoursesByWeek(courses);

	return (<React.Fragment>{coursesByWeek.map(courseWeek => (
		<React.Fragment key={courseWeek.key}>
			<h4>{t('common:week')} {courseWeek.week}</h4>
			<Row >
				{courseWeek.courses.map(course =>
					<Col sm="4" key={course.id}>
						<CourseCard course={course} />
					</Col>
				)}
			</Row>
		</React.Fragment>))}
		<Pagination page={page} lastPage={lastPage} urlForPage={(page) => '/courses/'+list+'/'+page} />
		</React.Fragment>);
}

export default withTranslation()(CourseCards);