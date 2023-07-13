import React from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons/index";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Placeholder from 'react-bootstrap/Placeholder';
import SignUpModal from './SignUpModal';
import { parseLocalDate } from '../shared/DateUtils';
import useCourseActions from '../actions/courses';

const Description = ({text}) => {
    if (!text) return null;
    return text
        .split('\n\n')
        .map((paragraph, i) => 
            <p key={i}>
                {paragraph
                    .split('\n')
                    .map((line, j) => 
                        <React.Fragment key={j}>
                            {line}<br/>
                        </React.Fragment>
                    )
                }
            </p>);
}

const CourseCard = ({ t, course }) => {
    const { signup, toggleSignupModal } = useCourseActions();
    const courseStartsAt = parseLocalDate(course.startsAt);
    const courseEndsAt = parseLocalDate(course.endsAt);
    const status = course.myParticipation == null ? null : course.myParticipation.participation.status
    const bg = status === "pending" ? "info" : status === "confirmed" ? "success" : "light";
    const text = status === "pending" || status === "confirmed" ? "white" : "dark";
    const mutedClass = status === "pending" || status === "confirmed" ? "" : "text-muted";
    return (
        <React.Fragment>
            <Card bg={bg} text={text} className="mb-4">
                <Card.Body>
                    <Card.Title>{ course.name } {process.env.PUBLIC_URL}</Card.Title>
                    <h6 className="card-subtitle mb-1">{ course.instructors.map(instructor => instructor.name).join(" & ") }</h6>
                    <Card.Text className={mutedClass}>{ t('courses:xLessons', {count: course.weeks}) }</Card.Text>
                    <Description text={course.description} />
                    <CourseStatus t={t} course={course} />
                    {" "}{course.canShow && (<Link to={'/courses/'+course.id} className="btn btn-secondary">{t('common:manage')}</Link>)}
                </Card.Body>
                <Card.Footer>
                    <small className={mutedClass}>{ t('courses:scheduleSummary', { startDate: courseStartsAt, endDate: courseEndsAt, count: course.weeks }) }</small>
                </Card.Footer>
            </Card>
            <SignUpModal course={course} close={() => toggleSignupModal(course.id, false)} signup={signup}  />
        </React.Fragment>
    );
}

const CourseStatus = ({ t, course }) => {
    const status = course.myParticipation == null ? null : course.myParticipation.participation.status

    const { toggleSignupModal, cancelSignup } = useCourseActions();

    return (
        <React.Fragment>
            {status === "pending" &&
                <p>
                    <FontAwesomeIcon icon={faCheckCircle} size="lg"/>
                    <span> {t('courses:signupRequested')} </span>
                    <Button variant='link' className="text-white" onClick={() => cancelSignup(course.id)}>({t('common:cancel').toLowerCase()})</Button>
                </p>
            }
            {status === "confirmed" &&
                <p>
                    <FontAwesomeIcon icon={faCheckCircle} size="lg"/> 
                    <span> {t('courses:signupConfirmed')} </span>
                    <Button variant='link' className="text-white" onClick={() => cancelSignup(course.id)}>({t('common:cancel').toLowerCase()})</Button>
                </p>
            }
            {(status === null || status === "cancelled") && course.allowRegistration && 
                <Button variant='primary' onClick={() => toggleSignupModal(course.id, true)}>{t('actions:signUp')}</Button>
            }
        </React.Fragment>
    );
}

export const CourseCardPlaceholder = () => 
    <Card className='mb-4'>
        <Card.Body>
            <Placeholder as={Card.Title} animation="glow">
                <Placeholder xs={10} />
            </Placeholder>
            <Placeholder as="h6" animation="glow">
                <Placeholder xs={8} />
            </Placeholder>
            <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={2} />
            </Placeholder>
            <Placeholder as="p"  animation="glow">
                <Placeholder xs={4} />
            </Placeholder>
            <Placeholder.Button variant="primary" xs={3} />
        </Card.Body>
        <Placeholder as={Card.Footer} animation='glow'>
            <Placeholder xs={6} />
        </Placeholder>
    </Card>;

export default withTranslation()(CourseCard);