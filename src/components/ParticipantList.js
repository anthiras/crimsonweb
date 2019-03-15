import React from 'react';
import ParticipantRow from "./ParticipantRow";
import { withTranslation } from 'react-i18next';

const ParticipantList = ({ t, courseId, participants, confirmCourseParticipant, cancelCourseParticipant }) => {
    return <table className="table">
        <thead>
            <tr>
                <th style={{width: "10%"}}>{t('courses:signupDate')}</th>
                <th style={{width: "5%"}}></th>
                <th style={{width: "40%"}}>{t('common:name')}</th>
                <th style={{width: "10%"}}>{t('courses:role')}</th>
                <th style={{width: "15%"}}>{t('common:status')}</th>
                <th style={{width: "20%"}} className="text-right">{t('common:actions')}</th>
            </tr>
        </thead>
        <tbody>
            {participants.map((participant, i) => 
                <ParticipantRow 
                    key={participant.id} 
                    participant={participant} 
                    number={i+1}
                    courseId={courseId}
                    confirmCourseParticipant={confirmCourseParticipant}
                    cancelCourseParticipant={cancelCourseParticipant} />)}
        </tbody>
    </table>
}

export default withTranslation()(ParticipantList);