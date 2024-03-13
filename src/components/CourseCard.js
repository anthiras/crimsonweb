import React from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Placeholder from 'react-bootstrap/Placeholder';
import { parseLocalDate } from '../shared/DateUtils';

const CourseCard = ({t, course}) => {
    const courseStartsAt = parseLocalDate(course.startsAt);
    const courseEndsAt = parseLocalDate(course.endsAt);
    const status = course.myParticipation == null ? null : course.myParticipation.participation.status;
    
    return <Link to={'/courses/'+course.id}>
        <div className={"rounded text-white p-2 m-1 " + (status === "confirmed" ? "bg-success" : "bg-primary")}>
            <div className='fw-bold overflow-hidden text-nowrap'>{course.name}</div>
            <div>{ t('courses:timeInterval', { startDate: courseStartsAt, endDate: courseEndsAt }) }</div>
        </div>
    </Link>;
}

export const CourseCardPlaceholder = () =>
    <Placeholder as="div" animation="glow" />

export default withTranslation()(CourseCard);