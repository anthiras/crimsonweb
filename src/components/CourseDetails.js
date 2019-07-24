import React, { Component } from 'react';
import ParticipantList from "./ParticipantList";
import { Loading } from './Utilities';
import { withTranslation } from 'react-i18next';
import { NavLink } from "react-router-dom";
import { TextAreaModal } from "./ConfirmModal";

class CourseDetails extends Component {
    constructor(props) {
        super(props);
        this.state = { sendMessageVisible: false }
        this.toggleModal = this.toggleModal.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    toggleModal(visible) {
        this.setState({ sendMessageVisible: visible });
    }

    sendMessage(message) {
        console.log("send msg", message);
        this.props.sendNotification(this.props.course.id, message);
        this.toggleModal(false);
    }

    render() {
        const { t, course, participants, confirmCourseParticipant, cancelCourseParticipant, setParticipantAmountPaid } = this.props;

        if (!course) {
            return <Loading />;
        }
        
        const {
            id,
            name,
            instructors
        } = course;

        const courseStartsAt = new Date(course.startsAt);
        const courseEndsAt = new Date(course.endsAt);

        return (
            <React.Fragment>
                <h1>{name}</h1>
                <p>{ instructors.map(instructor => instructor.name).join(" & ") }</p>
                <p>{ t('courses:scheduleSummary', { startDate: courseStartsAt, endDate: courseEndsAt, count: course.weeks }) }</p>
                
                <p>
                    <NavLink to={"/courses/"+id+"/edit"} className="btn btn-secondary">{ t('actions:editCourse') }</NavLink>
                    {" "}<button type="button" className="btn btn-secondary" onClick={() => this.toggleModal(true)}>{t('actions:messageParticipants')}</button>
                </p>

                <TextAreaModal
                    visible={this.state.sendMessageVisible}
                    title={t('courses:messagePendingAndConfirmedParticipants')}
                    onConfirm={this.sendMessage}
                    onCancel={() => this.toggleModal(false)}
                    confirmText={t('common:send')}
                    cancelText={t('common:cancel')}
                    rows="4"
                 />

                <h2>{t('courses:participants')}</h2>
                <ParticipantSummary participants={participants} t={t} />
                <ParticipantList 
                    courseId={id} 
                    participants={participants} 
                    confirmCourseParticipant={confirmCourseParticipant} 
                    cancelCourseParticipant={cancelCourseParticipant}
                    setParticipantAmountPaid={setParticipantAmountPaid} />
            </React.Fragment>
        );
    }
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