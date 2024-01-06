import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import useCourseActions from '../actions/courses';
import { ConfirmModal, NumberBoxModal } from './ConfirmModal';

const ParticipantActions = ({ t, participant, courseId }) => {
    const { participation } = participant;
    const { status } = participation;

    const { confirmCourseParticipant, cancelCourseParticipant, setParticipantAmountPaid } = useCourseActions();

    const [showCancel, toggleCancelModal] = useState(false);
    const [showAmount, toggleAmountModal] = useState(false);

    const confirmCancel = () => {
        toggleCancelModal(false);
        cancelCourseParticipant(courseId, participant.id);
    }

    const editAmount = (amountPaid) => {
        toggleAmountModal(false);
        setParticipantAmountPaid(courseId, participant.id, amountPaid);
    }

    const menuItems = [];

    if (status === 'pending' || status === 'confirmed') {
        menuItems.push({
            label: t('actions:reject'),
            command: () => toggleCancelModal(true)
        });
    }
    menuItems.push({
        label: t('courses:amountPaid') + '...',
        command: () => toggleAmountModal(true)
    })

    return <div>
        {status === 'pending' && <Button onClick={() => confirmCourseParticipant(courseId, participant.id)} variant="success" className="d-inline-block">{t('common:approve')}</Button>}
        {" "}
        <Dropdown className="d-inline-block">
            <Dropdown.Toggle variant="outline-secondary"></Dropdown.Toggle>
            <Dropdown.Menu>
                {menuItems.map(item => <Dropdown.Item key={item.label} onClick={item.command}>{item.label}</Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
        <NumberBoxModal 
            key={courseId+'_'+participant.id}
            visible={showAmount}
            onConfirm={editAmount}
            onCancel={() => toggleAmountModal(false)}
            title={t('courses:amountPaid')}
            confirmText={t('actions:save')}
            cancelText={t('common:cancel')}
            value={participation.amountPaid}
            type="number"
            step="0.01" />
        <ConfirmModal
            visible={showCancel}
            onConfirm={confirmCancel}
            onCancel={() => toggleCancelModal(false)}
            title={t('common:reject')}
            confirmText={t('common:reject')}
            cancelText={t('common:cancel')} >
            {t('courses:confirmReject')}
        </ConfirmModal>
    </div>
}

export default withTranslation()(ParticipantActions);