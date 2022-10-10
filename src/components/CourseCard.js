import React from 'react';
import SignUpModal from './SignUpModal';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons/index";
import { parseLocalDate } from '../shared/DateUtils';

const CourseCard = ({ t, course, toggleSignupModal, signup, cancelSignup }) => {
    const courseStartsAt = parseLocalDate(course.startsAt);
    const courseEndsAt = parseLocalDate(course.endsAt);
    const status = course.myParticipation == null ? null : course.myParticipation.participation.status
    const bgClass = status === "pending" ? "bg-info text-white" : status === "confirmed" ? "bg-success text-white" : "bg-light";
    const mutedClass = status === "pending" || status === "confirmed" ? "" : "text-muted";
    return (
        <React.Fragment>
            <div className={"card mb-4 "+bgClass}>
                <div className="card-body">
                    <h5 className="card-title">{ course.name } {process.env.PUBLIC_URL}</h5>
                    <h6 className="card-subtitle mb-1">{ course.instructors.map(instructor => instructor.name).join(" & ") }</h6>
                    <p className={"card-text "+mutedClass}>{ t('courses:xLessons', {count: course.weeks}) }</p>
                    <CourseStatus t={t} course={course} toggleSignupModal={toggleSignupModal} cancelSignup={cancelSignup} />
                    {" "}{course.canShow && (<Link to={'/courses/'+course.id} className="btn btn-secondary">{t('common:manage')}</Link>)}
                </div>
                <div className="card-footer">
                    <small className={mutedClass}>{ t('courses:scheduleSummary', { startDate: courseStartsAt, endDate: courseEndsAt, count: course.weeks }) }</small>
                </div>
            </div>
            <SignUpModal course={course} close={() => toggleSignupModal(course.id, false)} signup={signup}  />
        </React.Fragment>
    );
}

const CourseStatus = ({ t, course, toggleSignupModal, cancelSignup }) => {
    const status = course.myParticipation == null ? null : course.myParticipation.participation.status

    return (
        <React.Fragment>
            {status === "pending" &&
                <p>
                    <FontAwesomeIcon icon={faCheckCircle} size="lg"/>
                    <span> {t('courses:signupRequested')} </span>
                    <button className="btn btn-link text-white" onClick={() => cancelSignup(course.id)}>({t('common:cancel').toLowerCase()})</button>
                </p>
            }
            {status === "confirmed" &&
                <p>
                    <FontAwesomeIcon icon={faCheckCircle} size="lg"/> {t('courses:signupConfirmed')}
                    <button className="btn btn-link text-white" onClick={() => cancelSignup(course.id)}>({t('common:cancel').toLowerCase()})</button>
                </p>
            }
            {(status === null || status === "cancelled") && course.allowRegistration && 
                <button className="btn btn-primary" onClick={() => toggleSignupModal(course.id, true)}>{t('actions:signUp')}</button>
            }
        </React.Fragment>
    );
}

export default withTranslation()(CourseCard);