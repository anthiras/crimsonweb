import React, { useState } from 'react';
import ParticipantList from "./ParticipantList";
import { Loading } from './Utilities';
import { withTranslation } from 'react-i18next';
import { NavLink } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { TextAreaModal } from "./ConfirmModal";
import { UISTATE_SAVED, UISTATE_SAVING } from '../shared/uiState'
import { parseLocalDate } from '../shared/DateUtils';
import useCourseActions from '../actions/courses';

const CourseDetails = ({ t, course, participants }) => {
    const [sendMessageVisible, toggleModal] = useState(false);

    const { sendNotification, editNotification } = useCourseActions();

    const sendMessage = (message) => sendNotification(course.id, message);
    const editMessage = (message) => editNotification(course.id, message);
    const launchMessage = () => {
        editMessage('');
        toggleModal(true);
    };


    if (!course) {
        return <Loading />;
    }
    
    const {
        id,
        name,
        instructors,
        notificationUiState,
        notificationMessage
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

    return (
        <React.Fragment>
            <h1>{name}</h1>
            <p>{ instructors.map(instructor => instructor.name).join(" & ") }</p>
            <p>{ t('courses:scheduleSummary', { startDate: courseStartsAt, endDate: courseEndsAt, count: course.weeks }) }</p>
            
            <p>
                <NavLink to={"/courses/"+id+"/edit"} className="btn btn-secondary">{ t('actions:editCourse') }</NavLink>
                {" "}<Button variant="secondary" onClick={launchMessage}>{t('actions:messageParticipants')}</Button>
            </p>

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
             />

            <h2>{t('courses:participants')}</h2>
            <ParticipantSummary participants={participants} t={t} />
            <ParticipantList 
                courseId={id} 
                participants={participants} />
        </React.Fragment>
    );
}
const ParticipantSummary = ({t, participants }) => {
    const counts = participants.reduce((summary, participant) => {
        const status = participant.participation.status;
        const role = participant.participation.role;
        if (!summary.hasOwnProperty(status)) {
            summary[status] = { lead: 0, follow: 0 };
        }
        summary[status][role]++;
        return summary;
    }, {})

    const statusSummaries = Object.keys(counts).map(status => 
        <ParticipantStatusSummary key={status} t={t} status={status} lead={counts[status].lead} follow={counts[status].follow} />);

    return (<ul>{statusSummaries}</ul>);
}

const ParticipantStatusSummary = ({t, status, lead, follow }) => 
    (<li>{lead+follow} {t('courses:status:'+status)} ({lead} {t('courses:lead')} + {follow} {t('courses:follow')})</li>);

export default withTranslation()(CourseDetails);