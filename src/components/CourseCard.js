import React from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Placeholder from 'react-bootstrap/Placeholder';
import Badge from 'react-bootstrap/Badge';
import { parseLocalDate } from '../shared/DateUtils';

const CourseCard = ({t, course}) => {
    const courseStartsAt = parseLocalDate(course.startsAt);
    const courseEndsAt = parseLocalDate(course.endsAt);
    const status = course.myParticipation == null ? null : course.myParticipation.participation.status;
    const variant = 
        status === 'confirmed' ? 'alert-success' : 
        status === 'pending' ? 'alert-primary' :
        'alert-secondary';
    
    return <Link to={'/courses/'+course.id}>
        <div className={"p-2 m-1 alert " + variant}>
            <div className='fw-bold overflow-hidden text-nowrap'>{course.name}</div>
            <ParticipationStatus t={t} course={course} />
            <div>{ t('courses:timeInterval', { startDate: courseStartsAt, endDate: courseEndsAt }) }</div>
        </div>
    </Link>;
}

const ParticipationStatus = ({t, course}) => {
    const status = course.myParticipation == null ? null : course.myParticipation.participation.status;
    const style = {
        position: 'absolute',
        right: 10,
        bottom: 10
    };

    if (status === 'confirmed')
        return <Badge bg='success' text='white' style={style}>{t('courses:signupConfirmed')}</Badge>;

    if (status === 'pending')
        return <Badge bg='primary' text='white' style={style}>{t('courses:signupRequested')}</Badge>;

    if (course.allowRegistration)
        return <Badge bg='white' text='black' style={style}>{t('courses:openForRegistration')}</Badge>

    return null;
}

export const CourseCardPlaceholder = () =>
    <Placeholder as="div" animation="glow" />

export default withTranslation()(CourseCard);