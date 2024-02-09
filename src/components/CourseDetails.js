import React, { useState } from 'react';
import ParticipantList from "./ParticipantList";
import { withTranslation } from 'react-i18next';
import { NavLink } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { TextAreaModal } from "./ConfirmModal";
import { UISTATE_SAVED, UISTATE_SAVING } from '../shared/uiState'
import { parseLocalDate } from '../shared/DateUtils';
import useCourseActions from '../actions/courses';
import InstructorsAvatarGroup from './InstructorsAvatarGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPencil, faEnvelope} from "@fortawesome/free-solid-svg-icons/index";
import Description from './Description';
import SignUpModal from './SignUpModal';
import usePermissions from '../hooks/usePermissions';
import Participation from './Participation';

const CourseDetails = ({ t, course, participants }) => {
    const [sendMessageVisible, toggleModal] = useState(false);

    const { sendNotification, editNotification, signup, toggleSignupModal } = useCourseActions();

    const sendMessage = (message) => sendNotification(course.id, message);
    const editMessage = (message) => editNotification(course.id, message);
    const launchMessage = () => {
        editMessage('');
        toggleModal(true);
    };

    const {
        id,
        name,
        instructors,
        notificationUiState,
        notificationMessage,
        weeks,
    } = course;

    const courseStartsAt = parseLocalDate(course.startsAt);
    const courseEndsAt = parseLocalDate(course.endsAt);
    
    const sendMessageButtonText = 
        notificationUiState === UISTATE_SAVING ? t('common:sending') :
        notificationUiState === UISTATE_SAVED ? t('common:sent') :
            t('common:send');
    const sendMessageButtonVariant =
        notificationUiState === UISTATE_SAVING ? 'primary' :
        notificationUiState === UISTATE_SAVED ? 'success' :
            'primary';
    const sendMessageButtonDisabled = 
        notificationUiState === UISTATE_SAVING || notificationUiState === UISTATE_SAVED;

    const permissions = usePermissions();

    return (
        <Container fluid>
            {permissions["courses:create"] && 
                <div className="float-end">
                    <Button variant="outline-secondary" onClick={launchMessage} title={t('actions:messageParticipants')}>
                        <FontAwesomeIcon icon={faEnvelope} />
                    </Button>
                    {" "}
                    <NavLink to={"/courses/"+id+"/edit"} className="btn btn-outline-secondary" title={ t('actions:editCourse') }>
                        <FontAwesomeIcon icon={faPencil} />
                    </NavLink>
                </div>
            }
            <InstructorsAvatarGroup instructors={instructors} size='large' />
            <h1 className='mt-1'>{name}</h1>
            <p>{ t('courses:scheduleSummary', { startDate: courseStartsAt, endDate: courseEndsAt, count: weeks }) }</p>
            <Description text={course.description} />

            <TextAreaModal
                visible={sendMessageVisible}
                title={t('courses:messagePendingAndConfirmedParticipants')}
                onConfirm={sendMessage}
                onCancel={() => toggleModal(false)}
                onChange={editMessage}
                confirmText={sendMessageButtonText}
                cancelText={t('common:close')}
                rows="4"
                confirmVariant={sendMessageButtonVariant}
                confirmDisabled={sendMessageButtonDisabled}
                value={notificationMessage}
             >
                <p className='mt-3'>{t('courses:receivers')}:</p>
                <p style={{ whiteSpace: 'pre-wrap'}}>{participants.filter(p => p.participation.status !== 'cancelled').map(p => p.email + "\n")}</p>
            </TextAreaModal>

            <Participation course={course} />

            {permissions["courses:create"] && <Row>
                <ParticipantList 
                    lg={5}
                    role='lead'
                    courseId={id} 
                    participants={participants.filter(p => p.participation.role === 'lead')} />
                <ParticipantList 
                    lg={{span: 5, offset: 1}}
                    role='follow'
                    courseId={id} 
                    participants={participants.filter(p => p.participation.role === 'follow')} />
            </Row>}

            <SignUpModal course={course} close={() => toggleSignupModal(course.id, false)} signup={signup}  />
        </Container>
    );
}

export default withTranslation()(CourseDetails);