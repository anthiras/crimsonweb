import React from 'react';
import { withTranslation } from 'react-i18next';
import Col from 'react-bootstrap/Col';
import Participant from './Participant';

const ParticipantList = ({ t, courseId, participants, role, lg }) => {
    const countConfirmed = participants.filter(p => p.participation.status === 'confirmed').length;
    const countPending = participants.filter(p => p.participation.status === 'pending').length;

    return <Col lg={lg}>
        <h2>{t(`courses:${role}s`)}</h2>
        <div>{countConfirmed} {countPending > 0 && <span style={{color:'gray'}}>+ {countPending} {t('courses:status:pending').toLowerCase()}</span>}</div>   
        {participants.map(p => <Participant key={p.id} participant={p} courseId={courseId} />)}
    </Col>;
}

export default withTranslation()(ParticipantList);