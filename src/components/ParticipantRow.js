import React, { Component } from 'react';
import { ConfirmModal } from './ConfirmModal';
import { withNamespaces } from 'react-i18next';

class ParticipantRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cancelModalVisible: false
        }

        this.openCancelModal = this.openCancelModal.bind(this);
        this.closeCancelModal = this.closeCancelModal.bind(this);
        this.confirmCancel = this.confirmCancel.bind(this);
    }

    openCancelModal() {
        this.setState({cancelModalVisible: true})
    }

    closeCancelModal() {
        this.setState({cancelModalVisible: false})
    }

    confirmCancel() {
        this.closeCancelModal();
        this.props.cancelCourseParticipant(this.props.courseId, this.props.participant.id);
    }

    render() {
        const { t, courseId, participant, number, confirmCourseParticipant } = this.props;
        const {
            id,
            picture,
            name,
            participation
        } = participant;

        const userId = id;

        return (
            <tr className={participation.status=='cancelled' ? "text-muted" : ""}>
                <td>{participation.createdAt}</td>
                <td><img src={picture} width="50" height="50" alt={name} /></td>
                <td>{name}</td>
                <td>{t('courses:'+participation.role)}</td>
                <td>{t('courses:status:'+participation.status)}</td>
                <td>
                    <div className="text-right">
                        <div className="btn-group">
                            {participation.status === 'pending' && (
                                <React.Fragment>
                                <button type="button" className="btn btn-success" onClick={() => confirmCourseParticipant(courseId, userId)}>{t('common:approve')}</button>{" "}
                                <button type="button" className="btn btn-danger" onClick={this.openCancelModal}>{t('actions:reject')}</button>
                                </React.Fragment>
                            )}
                            {participation.status === 'confirmed' && (
                                <button type="button" className="btn btn-danger" onClick={this.openCancelModal}>{t('actions:reject')}</button>
                            )}
                        </div>
                    </div>
                    <ConfirmModal
                        visible={this.state.cancelModalVisible}
                        onConfirm={this.confirmCancel}
                        onCancel={this.closeCancelModal}
                        title={t('common:reject')}
                        confirmText={t('common:reject')}
                        cancelText={t('common:cancel')} >
                        {t('courses:confirmReject')}
                    </ConfirmModal>
                </td>
            </tr>);
    }
}

export default withNamespaces()(ParticipantRow);