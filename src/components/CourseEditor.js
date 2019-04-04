import React, { Component } from 'react';
import Select from 'react-select';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import { Loading, DatePicker, UserPicker } from './Utilities';
import { UISTATE_SAVED, UISTATE_SAVE_FAILED, UISTATE_SAVING } from '../shared/uiState'
import { NavLink } from 'react-router-dom'
import { ConfirmModal } from './ConfirmModal';

class CourseEditor extends Component {
	constructor(props) {
		super(props);

        this.SIGNUP_SCHEMES = [
            { value: 'none', label: props.t('courses:signupSchemeNone') },
            { value: 'manual', label: props.t('courses:signupSchemeManual') },
            { value: 'auto', label: props.t('courses:signupSchemeAuto') }
        ];

        this.ALLOW_REGISTRATION_OPTIONS = [
            { value: true, label: props.t('common:open') },
            { value: false, label: props.t('common:closed') },
        ];

        this.state = { 
            course: props.course == null 
                ? {
                    id: null,
                    name: '',
                    startsAtDate: moment().format("YYYY-MM-DD"),
                    startsAtTime: '20:00:00',
                    weeks: 8,
                    durationMinutes: 75,
                    instructors: [],
                    allowRegistration: this.getOption(this.ALLOW_REGISTRATION_OPTIONS, true),
                    autoConfirm: false,
                    signupScheme: this.getOption(this.SIGNUP_SCHEMES, 'none'),
                    maxParticipants: null,
                    maxRoleDifference: null } 
                : this.mapToState(props.course),
            deleteModalVisible: false
        };
        
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInput = this.handleInput.bind(this);
        this.openDeleteModal = this.openDeleteModal.bind(this);
        this.closeDeleteModal = this.closeDeleteModal.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
	}

    getOption(list, value) {
        return list.find(x => { return x.value === value });
    }

    mapToState(course) {
        let startsAt = moment(course.startsAt);

        let hasLimits = course.maxParticipants != null || course.maxRoleDifference != null;

        let signupScheme = 
            course.autoConfirm && hasLimits ? 'auto' 
            : course.autoConfirm ? 'none'
            : 'manual';

        return {
            id: course.id,
            name: course.name,
            startsAtDate: startsAt.format("YYYY-MM-DD"),
            startsAtTime: startsAt.format("HH:mm:ss"),
            weeks: course.weeks,
            durationMinutes: course.durationMinutes,
            instructors: course.instructors.map(user => { return { value: user.id, label: user.name }}),
            allowRegistration: this.getOption(this.ALLOW_REGISTRATION_OPTIONS, course.allowRegistration),
            autoConfirm: course.autoConfirm,
            signupScheme: this.getOption(this.SIGNUP_SCHEMES, signupScheme),
            maxParticipants: course.maxParticipants,
            maxRoleDifference: course.maxRoleDifference
        };
    }

    mapStateToData() {
        const course = this.state.course;
        return {
            id: course.id,
            name: course.name,
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

	handleInput(key, e) {
	    var value = e.target === undefined ? e : e.target.value;
        value = e.target !== undefined && e.target.type === 'checkbox' ? e.target.checked : value;
		var state = Object.assign({}, this.state.course);
    	state[key] = value;
    	this.setState({course: state });
        this.props.editCourseField();
	}

	handleSubmit(e) {
		e.preventDefault();

		let data = this.mapStateToData();

        this.props.saveCourse(data)
	}

    openDeleteModal() {
        this.setState({deleteModalVisible: true})
    }

    closeDeleteModal() {
        this.setState({deleteModalVisible: false})
    }

    confirmDelete() {
        this.closeDeleteModal();
        this.props.deleteCourse(this.state.course.id);
    }

	render() {
        const { t, uiState } = this.props;
        const course = this.state.course;

        if (course == null)
            return <Loading />;

        const buttonText =
            uiState === UISTATE_SAVING ? t('common:saving') :
            uiState === UISTATE_SAVED ? t('common:saved') :
                t('actions:saveCourse');

        // At least one rule limit should be set if choosing the auto scheme
        const autoLimitsAreValid = course.signupScheme.value !== 'auto' ||
            !isNaN(parseInt(course.maxParticipants)) ||
            !isNaN(parseInt(course.maxRoleDifference));

        const formValid = autoLimitsAreValid;

		return (
            <form onSubmit={this.handleSubmit}>
                <section>
                    <legend>{t('courses:courseInformation')}</legend>
                    <div className="form-group">
                        <label htmlFor="name">{t('common:name')}</label>
                        <input type="text" required id="name" className="form-control" value={course.name} onChange={(e)=>this.handleInput('name', e)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="instructors">{t('users:instructors')}</label>
                        <UserPicker value={course.instructors} onChange={(e)=>this.handleInput('instructors', e)} />
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-3 col-sm-6">
                            <label htmlFor="startsAt">{t('common:startDate')}</label>
                            <DatePicker date={course.startsAtDate} onChange={(val)=>this.handleInput('startsAtDate', val)} />
                        </div>
                        <div className="form-group col-md-3 col-sm-6">
                            <label htmlFor="startsAt">{t('common:time')}</label>
                            <input type="time" required id="startsAtTime" className="form-control" value={course.startsAtTime} onChange={(e)=>this.handleInput('startsAtTime', e)} />
                        </div>
                        <div className="form-group col-md-3 col-sm-6">
                            <label htmlFor="weeks">{t('common:weeks')}</label>
                            <input type="number" min="1" required id="weeks" className="form-control"  value={course.weeks} onChange={(e)=>this.handleInput('weeks', e)} />
                        </div>
                        <div className="form-group col-md-3 col-sm-6">
                            <label htmlFor="duration">{t('courses:lessonDuration')}</label>
                            <input type="number" min="1" required id="duration" className="form-control" value={course.durationMinutes} onChange={(e)=>this.handleInput('durationMinutes', e)} />
                        </div>
                    </div>
                </section>
                <section>
                    <legend>{t('courses:registrationRules')}</legend>
                    <div className="form-group">
                        <label htmlFor="signupScheme">{t('courses:signupScheme')}</label>
                        <Select id="signupScheme" options={this.SIGNUP_SCHEMES} value={course.signupScheme} onChange={(e) => this.handleInput('signupScheme', e)} />
                    </div>
                    {course.signupScheme.value === 'auto' &&
                        <div className="form-row">
                            <div className="form-group col-md-6 col-sm-6">
                                <label htmlFor="weeks">{t('courses:maxParticipants')}</label>
                                <input type="number" min="1" id="maxParticipants" className={"form-control" + (autoLimitsAreValid ? "" : " is-invalid")} value={course.maxParticipants || ''} onChange={(e)=>this.handleInput('maxParticipants', e)} />
                            </div>
                            <div className="form-group col-md-6 col-sm-6">
                                <label htmlFor="weeks">{t('courses:maxRoleDifference')}</label>
                                <input type="number" min="0" id="maxRoleDifference" className={"form-control" + (autoLimitsAreValid ? "" : " is-invalid")} value={course.maxRoleDifference || ''} onChange={(e)=>this.handleInput('maxRoleDifference', e)} />
                            </div>
                        </div>
                    }
                    <div className="form-group">
                        <label htmlFor="allowRegistration">{t('courses:openForRegistration')}</label>
                        <Select id="allowRegistration" options={this.ALLOW_REGISTRATION_OPTIONS} value={course.allowRegistration} onChange={(e) => this.handleInput('allowRegistration', e)} />
                    </div>
                </section>
                <div className="form-group">
                    {uiState === UISTATE_SAVE_FAILED && <div className="alert alert-danger">{t('common:errorSaving')}</div>}
                    <button type="submit" className={uiState === UISTATE_SAVED ? "btn btn-success" : "btn btn-primary"} disabled={!formValid}>{buttonText}</button>
                    {" "}
                    {course.id && <NavLink to={"/courses/"+course.id} className="btn btn-secondary">{ t('common:back') }</NavLink>}
                    {" "}
                    {course.id && <button type="button" className="btn btn-danger" onClick={this.openDeleteModal}>{t('actions:deleteCourse')}</button>}
                </div>
                <ConfirmModal 
                    visible={this.state.deleteModalVisible} 
                    onConfirm={this.confirmDelete}
                    onCancel={this.closeDeleteModal} 
                    title={t('common:pleaseConfirm')} 
                    confirmText={t('common:delete')} 
                    cancelText={t('common:cancel')} >
                    {t('common:confirmDelete')}
                </ConfirmModal>
            </form>
        );
	}
}

export default withTranslation()(CourseEditor);