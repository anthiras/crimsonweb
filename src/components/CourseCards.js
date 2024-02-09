import React from 'react';
import { withTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import { Pagination } from './Utilities';
import { parseLocalDate } from '../shared/DateUtils';
import CourseCard, { CourseCardPlaceholder } from '../components/CourseCard'
import Placeholder from 'react-bootstrap/Placeholder';
import styles from './CourseCards.module.css';

// const groupCoursesByWeek = courses => {
// 	let coursesByWeek = [];
// 	let currentKey = null;
// 	for (let i = 0; i < courses.length; i++) {
// 		let course = courses[i];
// 		let startsAt = parseLocalDate(course.startsAt);
// 		let week = weekNumber(startsAt)
// 		let key = startsAt.getFullYear() + '-' + week;
// 		if (key !== currentKey) {
// 			coursesByWeek.push({ key: key, week: week, courses: []});
// 			currentKey = key;
// 		}
// 		coursesByWeek[coursesByWeek.length-1].courses.push(course);
// 	}
// 	return coursesByWeek;
// }

const monthYear = date => date.getFullYear() + date.getMonth().toString().padStart(2, '0');

const groupCoursesByMonth = courses => {
	const groups = [];
	courses.forEach(c => {
		const key = monthYear(parseLocalDate(c.startsAt));
		if (groups.length === 0 || groups[groups.length-1].key !== key) {
			groups.push({ key: key, courses: []});
		}
		groups[groups.length-1].courses.push(c);
	});
	return groups;
}

const groupCoursesByDay = courses => {
	const groups = [];
	courses.forEach(c => {
		const key = parseLocalDate(c.startsAt).getDate().toString();
		if (groups.length === 0 || groups[groups.length-1].key !== key) {
			groups.push({ key: key, courses: []});
		}
		groups[groups.length-1].courses.push(c);
	});
	return groups;
}

const CourseCardsPlaceholder = () => (
	<Container fluid>
		<Placeholder as="h4" animation="glow">
			<Placeholder xs={2} />
		</Placeholder>
		<CourseCardPlaceholder />
		<CourseCardPlaceholder />
		<CourseCardPlaceholder />
</Container>);

const CourseCards = ({ t, courses, page, lastPage, list, isFetching }) => {
	if (isFetching)
		return <CourseCardsPlaceholder />;

	if (courses.length === 0)
		return (<p className="lead text-center text-muted my-5">{t('courses:noCoursesFound')}</p>);

	const coursesByMonth = groupCoursesByMonth(courses);

	return <>
		{coursesByMonth.map(courseMonth => (
		<React.Fragment key={courseMonth.key}>
			<Container fluid>
				<h4 className='text-capitalize'>{t('courses:monthYear', { date: parseLocalDate(courseMonth.courses[0].startsAt) })}</h4>
			</Container>
			<table className={'table table-vertical-borders '+styles.table}>
				<tbody>
				{groupCoursesByDay(courseMonth.courses).map(courseDay => 
				<tr key={courseDay.key}>
					<th>{t('courses:shortDate', { date: parseLocalDate(courseDay.courses[0].startsAt) })}</th>
					<td>
						{courseDay.courses.map(course => <CourseCard course={course} key={course.id} />)}
					</td>
				</tr>
				)}
				</tbody>
			</table>
		</React.Fragment>))}
		{lastPage > 1 && <Pagination page={page} lastPage={lastPage} urlForPage={(page) => '/courses/'+list+'/'+page} />}
		</>;
		
		
}

export default withTranslation()(CourseCards);