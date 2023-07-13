import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import { formatDate, parseUtcDate } from '../shared/DateUtils';
import useCourseActions from '../actions/courses';
import { ConfirmModal, NumberBoxModal } from './ConfirmModal';

const ParticipantRow = ({ t, participant, courseId }) => {
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

    const {
        id,
        picture,
        name,
        email,
        participation,
        currentMembership
    } = participant;

    const userId = id;

    const memberNotPaid = currentMembership != null && currentMembership.paidAt == null;
    const memberPaid = currentMembership != null && currentMembership.paidAt != null;

    return (
        <tr className={participation.status==='cancelled' ? "text-muted" : ""}>
            <td>{formatDate(parseUtcDate(participation.signedUpAt))}</td>
            <td className="position-relative">
                <img src={picture} width="50" height="50" alt={name} className="rounded" />
            </td>
            <td>
                {name}
                {memberPaid && <span className="badge badge-pill badge-info" title={t('users:member') + ' - ' + t('membership:membershipPaid')}>{t('users:member')}</span>}
                {memberNotPaid && <span className="badge badge-pill badge-warning" title={t('users:member') + ' - ' + t('membership:membershipUnpaid')}>{t('users:member')}</span>}
            </td>
            <td>{email}</td>
            <td>{t('courses:'+participation.role)}</td>
            <td>{t('courses:status:'+participation.status)}</td>
            <td>
                {participation.amountPaid} <Button variant="light" className="btn-sm" onClick={() => toggleAmountModal(true)}>...</Button>
                <NumberBoxModal 
                    key={courseId+'_'+userId}
                    visible={showAmount}
                    onConfirm={editAmount}
                    onCancel={() => toggleAmountModal(false)}
                    title={t('courses:amountPaid')}
                    confirmText={t('actions:save')}
                    cancelText={t('common:cancel')}
                    value={participation.amountPaid}
                    type="number"
                    step="0.01" />
            </td>
            <td>
                <div className="text-right">
                    <div className="btn-group">
                        {participation.status === 'pending' && (
                            <React.Fragment>
                            <Button variant="success" onClick={() => confirmCourseParticipant(courseId, userId)}>{t('common:approve')}</Button>{" "}
                            <Button variant="danger" onClick={() => toggleCancelModal(true)}>{t('actions:reject')}</Button>
                            </React.Fragment>
                        )}
                        {participation.status === 'confirmed' && (
                            <Button variant="danger" onClick={() => toggleCancelModal(true)}>{t('actions:reject')}</Button>
                        )}
                    </div>
                </div>
                <ConfirmModal
                    visible={showCancel}
                    onConfirm={confirmCancel}
                    onCancel={() => toggleCancelModal(false)}
                    title={t('common:reject')}
                    confirmText={t('common:reject')}
                    cancelText={t('common:cancel')} >
                    {t('courses:confirmReject')}
                </ConfirmModal>
            </td>
        </tr>);
};

export default withTranslation()(ParticipantRow);