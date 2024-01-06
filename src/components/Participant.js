import React from "react";
import { withTranslation } from 'react-i18next';
import { Avatar } from "primereact/avatar";
import Badge from 'react-bootstrap/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson, faPersonDress } from "@fortawesome/free-solid-svg-icons/index";
import ParticipantActions from "./ParticipantActions";

const Participant = ({ t, courseId, participant }) => {
    const { participation, name, currentMembership } = participant;
    const { role, status, amountPaid } = participation;
    const memberPaid = currentMembership?.paidAt != null;

    return <div className="d-flex align-items-center my-3">
        <Avatar 
            size="large"
            shape="circle"
            className="p-overlay-badge"
            label={
                <FontAwesomeIcon
                    icon={role === 'lead' ? faPerson : faPersonDress}
                    style={{color: status === 'confirmed' ? 'black' : 'gray'}}
                />
            } />
        <div className="mx-2 flex-grow-1 d-flex flex-column">
            <div className={status === 'cancelled' ? 'text-decoration-line-through text-secondary' : ''}>
                {name}
            </div>
            <div>
                <Badge bg={status === 'confirmed' ? 'success' : status === 'cancelled' ? 'danger' : 'warning'}>{t('courses:status:'+status)}</Badge>
                {" "}
                <Badge bg='secondary'>{memberPaid ? t('membership:member') : t('membership:notAMember')}</Badge>
                {" "}
                {amountPaid > 0 && <Badge bg="secondary">{t('courses:amountPaid')} {amountPaid}</Badge>}
            </div>
        </div>
        <ParticipantActions t={t} participant={participant} courseId={courseId} />
    </div>;
};

export default withTranslation()(Participant);