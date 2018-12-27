import React, {Component} from 'react';
import moment from 'moment';
import {get} from "./Api";
import ParticipantList from "./ParticipantList";
import CourseEditor from './CourseEditor';
import { Loading } from './Utilities';
import { withNamespaces } from 'react-i18next';
import { NavLink } from "react-router-dom";

class CourseDetails extends Component
{
    constructor(props) {
        super(props);
        this.courseId = props.match.params.courseId;
        this.state = {
            course: null,
            uiState: 'show'
        }
    }

    componentDidMount() {
        get('/v1/courses/'+this.courseId).then(course => {
            this.setState({ course });
        });
    }

    render() {
        if (this.state.course == null) {
            return <Loading />;
        }
        if (this.state.uiState === 'edit') {
            return <CourseEditor course={this.state.course} />
        }
        const t = this.props.t;
        const {
            name,
            instructors,
            startsAt,
            durationMinutes,
            participants
        } = this.state.course;

        const courseStartsAt = moment(startsAt);
        let firstLessonEndsAt = courseStartsAt.clone();
        firstLessonEndsAt.add(durationMinutes, 'm');

        return (
            <React.Fragment>
                <h1>{name}</h1>
                <p>{ instructors.map(instructor => instructor.name).join(" & ") }</p>
                <p>{ courseStartsAt.format("dddd") }s { courseStartsAt.format("HH:mm") }–{ firstLessonEndsAt.format("HH:mm") } from { courseStartsAt.format("MMM D") }</p>
                {/*<button className="btn btn-secondary" onClick={() => this.setState({'uiState': 'edit'})}>{ t('actions:editCourse') }</button>*/}
                <NavLink to={"/courses/"+this.courseId+"/edit"} className="btn btn-secondary">{ t('actions:editCourse') }</NavLink>
                <h2>Participants</h2>
                <ParticipantList participants={participants} />
            </React.Fragment>
        );
    }
}

export default withNamespaces()(CourseDetails);