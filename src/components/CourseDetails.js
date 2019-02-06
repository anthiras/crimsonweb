import React from 'react';
import ParticipantList from "./ParticipantList";
import { Loading } from './Utilities';
import { withNamespaces } from 'react-i18next';
import { NavLink } from "react-router-dom";

const CourseDetails = ({ t, course, participants }) => {
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
            
            <NavLink to={"/courses/"+id+"/edit"} className="btn btn-secondary">{ t('actions:editCourse') }</NavLink>
            <h2>{t('courses:participants')}</h2>
            <ParticipantList participants={participants} />
        </React.Fragment>
    );
}

export default withNamespaces()(CourseDetails);