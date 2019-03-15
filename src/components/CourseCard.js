import React from 'react';
import CourseSignUp from './CourseSignUp';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

const CourseCard = ({ t, course, toggleSignupModal, signup, cancelSignup }) => {
    const courseStartsAt = new Date(course.startsAt);
    const courseEndsAt = new Date(course.endsAt);
    const status = course.myParticipation == null ? null : course.myParticipation.participation.status
    const bgClass = status === "pending" || status === "confirmed" ? "bg-success text-white" : "bg-light";
    const mutedClass = status === "pending" || status === "confirmed" ? "" : "text-muted";
    return (
        <div className={"card mb-4 "+bgClass}>
            <div className="card-body">
                <h5 className="card-title">{ course.name } {process.env.PUBLIC_URL}</h5>
                <h6 className="card-subtitle mb-1">{ course.instructors.map(instructor => instructor.name).join(" & ") }</h6>
                <p className={"card-text "+mutedClass}>{ t('courses:xLessons', {count: course.weeks}) }</p>
                <CourseSignUp course={course} 
                    toggleSignupModal={toggleSignupModal} signup={signup} cancelSignup={cancelSignup} />
                {" "}{course.canShow && (<Link to={'/courses/'+course.id} className="btn btn-secondary">{t('common:manage')}</Link>)}
            </div>
            <div className="card-footer">
                <small className={mutedClass}>{ t('courses:scheduleSummary', { startDate: courseStartsAt, endDate: courseEndsAt, count: course.weeks }) }</small>
            </div>
        </div>
    );
}

export default withTranslation()(CourseCard);