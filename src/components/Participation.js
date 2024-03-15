import React from 'react';
import { withTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import useCourseActions from '../actions/courses';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheckCircle, faClock} from "@fortawesome/free-solid-svg-icons/index";
import Alert from 'react-bootstrap/Alert';

const Participation = ({ t, course }) => {
    const status = course.myParticipation == null ? null : course.myParticipation.participation.status

    const { toggleSignupModal, cancelSignup } = useCourseActions();

    const alertVariant = status === 'confirmed' ? 'success' : 'primary';
    const signedUp = status === 'pending' || status === 'confirmed';

    if (!signedUp)
        return <div className='d-grid mb-3'>
            {course.allowRegistration
            ? <Button variant='primary' size='lg' onClick={() => toggleSignupModal(course.id, true)}>{t('actions:signUp')}</Button>
            : <Button variant='secondary' size='lg' disabled>{t('courses:signupNotOpen')}</Button>}
        </div>

    return <Alert variant={alertVariant}>
        <div>
            <FontAwesomeIcon icon={faCheckCircle} size='lg' />
            <span> {t('courses:signupRequested')} </span>
            <Button className='float-end' variant='secondary' size='sm' onClick={() => cancelSignup(course.id)}>{t('common:cancel')}</Button>
        </div>
        {status === 'pending' && <div>
            <FontAwesomeIcon icon={faClock} size='lg' className='text-secondary' />
            <span className='text-secondary'> {t('courses:signupPending')} </span>
            </div>}
        {status === 'confirmed' && <div>
            <FontAwesomeIcon icon={faCheckCircle} size='lg' />
            <span className='fw-bold'> {t('courses:signupConfirmed')} </span>
            </div>}
    </Alert>;
}


export default withTranslation()(Participation);