import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons/index";
import SignUpModal from './SignUpModal';
import { withTranslation } from 'react-i18next';

const CourseSignUp = ({ t, course, toggleSignupModal, signup, cancelSignup }) => {
    const status = course.myParticipation == null ? null : course.myParticipation.participation.status

    return (
        <React.Fragment>
            <SignUpModal course={course} close={() => toggleSignupModal(course.id, false)} signup={signup}  />
            {status === "pending" &&
                <p>
                    <FontAwesomeIcon icon={faCheckCircle} size="lg"/>
                    <span> {t('courses:signupRequested')} </span>
                    <button className="btn btn-link text-white" onClick={() => cancelSignup(course.id)}>({t('common:cancel').toLowerCase()})</button>
                </p>
            }
            {status === "confirmed" &&
                <p><FontAwesomeIcon icon={faCheckCircle} size="lg"/> {t('courses:signupConfirmed')}</p>
            }
            {(status === null || status === "cancelled") && course.allowRegistration && 
                <button className="btn btn-primary" onClick={() => toggleSignupModal(course.id, true)}>{t('actions:signUp')}</button>
            }
        </React.Fragment>
    );
}

export default withTranslation()(CourseSignUp);