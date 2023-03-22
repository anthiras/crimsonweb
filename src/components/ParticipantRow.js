import React, { Component } from 'react';
import { ConfirmModal, NumberBoxModal } from './ConfirmModal';
import { withTranslation } from 'react-i18next';
import { formatDate, parseUtcDate } from '../shared/DateUtils';

class ParticipantRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modals: {
                cancel: false,
                amount: false
            }
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.confirmCancel = this.confirmCancel.bind(this);
        this.editAmount = this.editAmount.bind(this);
    }

    toggleModal(name, visible) {
        var state = Object.assign({}, this.state.modals);
        state[name] = visible;
        this.setState({ modals: state });
    }

    confirmCancel() {
        this.toggleModal('cancel', false);
        this.props.cancelCourseParticipant(this.props.courseId, this.props.participant.id);
    }

    editAmount(amountPaid) {
        this.toggleModal('amount', false);
        this.props.setParticipantAmountPaid(this.props.courseId, this.props.participant.id, amountPaid)
    }

    render() {
        const { t, courseId, participant, confirmCourseParticipant } = this.props;
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
                    {participation.amountPaid} <button className="btn btn-light btn-sm" onClick={() => this.toggleModal('amount', true)}>🖉</button>
                    <NumberBoxModal 
                        key={courseId+'_'+userId}
                        visible={this.state.modals.amount}
                        onConfirm={this.editAmount}
                        onCancel={() => this.toggleModal('amount', false)}
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
                                <button type="button" className="btn btn-success" onClick={() => confirmCourseParticipant(courseId, userId)}>{t('common:approve')}</button>{" "}
                                <button type="button" className="btn btn-danger" onClick={() => this.toggleModal('cancel', true)}>{t('actions:reject')}</button>
                                </React.Fragment>
                            )}
                            {participation.status === 'confirmed' && (
                                <button type="button" className="btn btn-danger" onClick={() => this.toggleModal('cancel', true)}>{t('actions:reject')}</button>
                            )}
                        </div>
                    </div>
                    <ConfirmModal
                        visible={this.state.modals.cancel}
                        onConfirm={this.confirmCancel}
                        onCancel={() => this.toggleModal('cancel', false)}
                        title={t('common:reject')}
                        confirmText={t('common:reject')}
                        cancelText={t('common:cancel')} >
                        {t('courses:confirmReject')}
                    </ConfirmModal>
                </td>
            </tr>);
    }
}

export default withTranslation()(ParticipantRow);