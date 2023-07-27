import React, { useState } from 'react';
import Select from 'react-select';
import { withTranslation } from 'react-i18next';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { Loading, DatePicker, UserPicker } from './Utilities';
import { UISTATE_SAVED, UISTATE_SAVE_FAILED, UISTATE_SAVING } from '../shared/uiState'
import { NavLink } from 'react-router-dom'
import { ConfirmModal } from './ConfirmModal';
import { format } from 'date-fns-tz'
import { parseLocalDate } from '../shared/DateUtils';
import useCourseActions from '../actions/courses';

const getSignupSchemes = (t) => [
    { value: 'none', label: t('courses:signupSchemeNone') },
    { value: 'manual', label: t('courses:signupSchemeManual') },
    { value: 'auto', label: t('courses:signupSchemeAuto') },
];

const getAllowRegistrationOptions = (t) => [
    { value: true, label: t('common:open') },
    { value: false, label: t('common:closed') },
];

const CourseEditor = ({ t, course, uiState }) => {
    const signupSchemes = getSignupSchemes(t);
    const allowRegistrationOptions = getAllowRegistrationOptions(t);

    const getOption = (list, value) => list.find(x => { return x.value === value });

    const { deleteCourse, editCourseField, saveCourse } = useCourseActions();

    const mapToState = (course) => {
        let startsAt = parseLocalDate(course.startsAt);

        let hasLimits = course.maxParticipants != null || course.maxRoleDifference != null;

        let signupScheme = 
            course.autoConfirm && hasLimits ? 'auto' 
            : course.autoConfirm ? 'none'
            : 'manual';

        return {
            id: course.id,
            name: course.name,
            description: course.description,
            startsAtDate: format(startsAt, "yyyy-MM-dd"),
            startsAtTime: format(startsAt, "HH:mm:ss"),
            weeks: course.weeks,
            durationMinutes: course.durationMinutes,
            instructors: course.instructors.map(user => ({ value: user.id, label: user.name })),
            allowRegistration: getOption(allowRegistrationOptions, course.allowRegistration),
            autoConfirm: course.autoConfirm,
            signupScheme: getOption(signupSchemes, signupScheme),
            maxParticipants: course.maxParticipants,
            maxRoleDifference: course.maxRoleDifference
        };
    };

    const mapStateToData = (course) => {
        return {
            id: course.id,
            name: course.name,
            description: course.description,
            startsAt: course.startsAtDate + " " + course.startsAtTime,
            weeks: parseInt(course.weeks),
            durationMinutes: parseInt(course.durationMinutes),
            instructors: course.instructors.map(user => user.value),
            allowRegistration: course.allowRegistration.value,
            autoConfirm: course.signupScheme.value === 'auto' || course.signupScheme.value === 'none',
            maxParticipants: course.signupScheme.value === 'auto' ? parseInt(course.maxParticipants) : null,
            maxRoleDifference: course.signupScheme.value === 'auto' ? parseInt(course.maxRoleDifference) : null
        };
    }

    const [draft, setDraft] = useState(course == null
        ? {
            id: null,
            name: '',
            description: '',
            startsAtDate: format(new Date(), "yyyy-MM-dd"),
            startsAtTime: '20:00:00',
            weeks: 8,
            durationMinutes: 75,
            instructors: [],
            allowRegistration: getOption(allowRegistrationOptions, true),
            autoConfirm: false,
            signupScheme: getOption(signupSchemes, 'none'),
            maxParticipants: null,
            maxRoleDifference: null,
        } 
        : mapToState(course));

    const [deleteModalVisible, toggleDeleteModal] = useState(false);


	const handleInput = (key, e) => {
	    var value = e.target === undefined ? e : e.target.value;
        value = e.target !== undefined && e.target.type === 'checkbox' ? e.target.checked : value;
		var state = Object.assign({}, draft);
    	state[key] = value;
    	setDraft(state);
        editCourseField();
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		let data = mapStateToData(draft);

        saveCourse(data);
	};

    const openDeleteModal = () => {
        toggleDeleteModal(true);
    }

    const closeDeleteModal = () => {
        toggleDeleteModal(false);
    }

    const confirmDelete = () => {
        closeDeleteModal();
        deleteCourse(draft.id);
    }

    if (draft == null)
        return <Loading />;

    const buttonText =
        uiState === UISTATE_SAVING ? t('common:saving') :
        uiState === UISTATE_SAVED ? t('common:saved') :
            t('actions:saveCourse');

    // At least one rule limit should be set if choosing the auto scheme
    const maxParticipantsValid = !isNaN(parseInt(draft.maxParticipants));
    const maxRoleDifferenceValid = !isNaN(parseInt(draft.maxRoleDifference));
    const autoLimitsAreValid = 
        draft.signupScheme.value !== 'auto' ||
        maxParticipantsValid ||
        maxRoleDifferenceValid;

    const formValid = autoLimitsAreValid;

    return (
        <Form onSubmit={handleSubmit}>
            <section>
                <legend>{t('courses:courseInformation')}</legend>
                <Form.Group>
                    <Form.Label>{t('common:name')}</Form.Label>
                    <Form.Control type="text" required value={draft.name} onChange={(e)=>handleInput('name', e)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>{t('common:description')}</Form.Label>
                    <Form.Control as="textarea" value={draft.description} onChange={(e)=>handleInput('description', e)} rows="3" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>{t('users:instructors')}</Form.Label>
                    <UserPicker value={draft.instructors} onChange={(e)=>handleInput('instructors', e)} />
                </Form.Group>
                <Row>
                    <Form.Group as={Col} className="col-md-3 col-sm-6 col-12">
                        <Form.Label>{t('common:startDate')}</Form.Label>
                        <DatePicker date={draft.startsAtDate} onChange={(val)=>handleInput('startsAtDate', val)} />
                    </Form.Group>
                    <Form.Group as={Col} className="col-md-3 col-sm-6 col-12">
                        <Form.Label>{t('common:time')}</Form.Label>
                        <Form.Control type="time" required id="startsAtTime" value={draft.startsAtTime} onChange={(e)=>handleInput('startsAtTime', e)} />
                    </Form.Group>
                    <Form.Group as={Col} className="col-md-3 col-sm-6 col-12">
                        <Form.Label>{t('common:weeks')}</Form.Label>
                        <Form.Control type="number" min="1" required id="weeks" value={draft.weeks} onChange={(e)=>handleInput('weeks', e)} />
                    </Form.Group>
                    <Form.Group as={Col} className="col-md-3 col-sm-6 col-12">
                        <Form.Label>{t('courses:lessonDuration')}</Form.Label>
                        <Form.Control type="number" min="1" required id="duration" value={draft.durationMinutes} onChange={(e)=>handleInput('durationMinutes', e)} />
                    </Form.Group>
                </Row>
            </section>
            <section>
                <legend>{t('courses:registrationRules')}</legend>
                <Form.Group>
                    <Form.Label>{t('courses:signupScheme')}</Form.Label>
                    <Select id="signupScheme" options={signupSchemes} value={draft.signupScheme} onChange={(e) => handleInput('signupScheme', e)} />
                </Form.Group>
                {draft.signupScheme.value === 'auto' &&
                    <Row>
                        <Form.Group as={Col} className="col-md-3 col-sm-6 col-12">
                            <Form.Label>{t('courses:maxParticipants')}</Form.Label>
                            <Form.Control type="number" min="1" id="maxParticipants" className={autoLimitsAreValid ? "" : "is-invalid"} value={maxParticipantsValid ? draft.maxParticipants : ''} onChange={(e)=>handleInput('maxParticipants', e)} />
                        </Form.Group>
                        <Form.Group as={Col} className="col-md-3 col-sm-6 col-12">
                            <Form.Label>{t('courses:maxRoleDifference')}</Form.Label>
                            <Form.Control type="number" min="0" id="maxRoleDifference" className={autoLimitsAreValid ? "" : " is-invalid"} value={maxRoleDifferenceValid ? draft.maxRoleDifference : ''} onChange={(e)=>handleInput('maxRoleDifference', e)} />
                        </Form.Group>
                    </Row>
                }
                <Form.Group>
                    <Form.Label>{t('courses:openForRegistration')}</Form.Label>
                    <Select id="allowRegistration" options={allowRegistrationOptions} value={draft.allowRegistration} onChange={(e) => handleInput('allowRegistration', e)} />
                </Form.Group>
            </section>
            <Form.Group>
                {uiState === UISTATE_SAVE_FAILED && <Alert variant="danger">{t('common:errorSaving')}</Alert>}
                <Button type="submit" variant={uiState === UISTATE_SAVED ? "success" : "primary"} disabled={!formValid}>{buttonText}</Button>
                {" "}
                {draft.id && <NavLink to={"/courses/"+draft.id} className="btn btn-secondary">{ t('common:back') }</NavLink>}
                {" "}
                {draft.id && <Button variant="danger" onClick={openDeleteModal}>{t('actions:deleteCourse')}</Button>}
            </Form.Group>
            <ConfirmModal 
                visible={deleteModalVisible} 
                onConfirm={confirmDelete}
                onCancel={closeDeleteModal} 
                title={t('common:pleaseConfirm')} 
                confirmText={t('common:delete')} 
                cancelText={t('common:cancel')} >
                {t('common:confirmDelete')}
            </ConfirmModal>
        </Form>
    );
}

export default withTranslation()(CourseEditor);