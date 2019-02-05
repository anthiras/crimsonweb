import React from 'react';
import moment from 'moment';
import ParticipantList from "./ParticipantList";
import { Loading } from './Utilities';
import { withNamespaces } from 'react-i18next';
import { NavLink } from "react-router-dom";

const CourseDetails = ({ t, course }) => {
    if (!course) {
        return <Loading />;
    }
    
    const {
        id,
        name,
        instructors,
        startsAt,
        durationMinutes,
        //participants
    } = course;

    const courseStartsAt = moment(startsAt);
    let firstLessonEndsAt = courseStartsAt.clone();
    firstLessonEndsAt.add(durationMinutes, 'm');

    return (
        <React.Fragment>
            <h1>{name}</h1>
            <p>{ instructors.map(instructor => instructor.name).join(" & ") }</p>
            <p>{ courseStartsAt.format("dddd") }s { courseStartsAt.format("HH:mm") }–{ firstLessonEndsAt.format("HH:mm") } from { courseStartsAt.format("MMM D") }</p>
            {/*<button className="btn btn-secondary" onClick={() => this.setState({'uiState': 'edit'})}>{ t('actions:editCourse') }</button>*/}
            <NavLink to={"/courses/"+id+"/edit"} className="btn btn-secondary">{ t('actions:editCourse') }</NavLink>
            {/*<h2>Participants</h2>
            <ParticipantList participants={participants} />*/}
        </React.Fragment>
    );
}

export default withNamespaces()(CourseDetails);