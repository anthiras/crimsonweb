import React, { Component } from 'react';
import AsyncSelect from 'react-select/lib/Async';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import { Loading } from './Utilities';
import { get } from '../shared/Api'
import { UISTATE_SAVED, UISTATE_SAVE_FAILED, UISTATE_SAVING } from '../shared/uiState'
import { NavLink } from 'react-router-dom'
import { ConfirmModal } from './ConfirmModal';

class CourseEditor extends Component {
	constructor(props) {
		super(props);
        this.state = { 
            course: props.course == null 
                ? {
                    id: null,
                    name: '',
                    startsAtDate: moment().format("YYYY-MM-DD"),
                    startsAtTime: '20:00:00',
                    weeks: 8,
                    durationMinutes: 75,
                    instructors: [] } 
                : this.mapToState(props.course),
            deleteModalVisible: false
        };
        
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInput = this.handleInput.bind(this);
        this.openDeleteModal = this.openDeleteModal.bind(this);
        this.closeDeleteModal = this.closeDeleteModal.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
	}

    mapToState(course) {
        let startsAt = moment(course.startsAt);
        return {
            id: course.id,
            name: course.name,
            startsAtDate: startsAt.format("YYYY-MM-DD"),
            startsAtTime: startsAt.format("HH:mm:ss"),
            weeks: course.weeks,
            durationMinutes: course.durationMinutes,
            instructors: course.instructors.map(user => { return { value: user.id, label: user.name }})
        };
    }

    mapStateToData() {
        return {
            id: this.state.course.id,
            name: this.state.course.name,
            startsAt: this.state.course.startsAtDate + " " + this.state.course.startsAtTime,
            weeks: this.state.course.weeks,
            durationMinutes: this.state.course.durationMinutes,
            instructors: this.state.course.instructors.map(user => user.value)
        };
    }

	handleInput(key, e) {
	    var value = e.target === undefined ? e : e.target.value;
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

	searchUsers(input) {
	    return get('/v1/users?query='+input)
            .then(result => result.data.map(user => {
                    return {
                        value: user.id,
                        label: user.name
                    }
                })
            );
    }

	render() {
        const { t, uiState } = this.props;
        const course = this.state.course;

        if (this.state.course == null)
            return <Loading />;

        const buttonText =
            uiState === UISTATE_SAVING ? t('common:saving') :
            uiState === UISTATE_SAVED ? t('common:saved') :
                t('actions:saveCourse');

		return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">{t('common:name')}</label>
                    <input type="text" required id="name" className="form-control" value={this.state.course.name} onChange={(e)=>this.handleInput('name', e)} />
                </div>
                <div className="form-group">
                    <label htmlFor="instructors">{t('users:instructors')}</label>
                    <AsyncSelect name="instructors" cacheOptions isMulti loadOptions={this.searchUsers} value={this.state.course.instructors} onChange={(e)=>this.handleInput('instructors', e)} />
                </div>
                <div className="form-row">
                    <div className="form-group col-md-3 col-sm-6">
                        <label htmlFor="startsAt">{t('common:startDate')}</label>
                        <input type="date" required id="startsAtDate" className="form-control" value={this.state.course.startsAtDate} onChange={(e)=>this.handleInput('startsAtDate', e)} />
                    </div>
                    <div className="form-group col-md-3 col-sm-6">
                        <label htmlFor="startsAt">{t('common:time')}</label>
                        <input type="time" required id="startsAtTime" className="form-control" value={this.state.course.startsAtTime} onChange={(e)=>this.handleInput('startsAtTime', e)} />
                    </div>
                    <div className="form-group col-md-3 col-sm-6">
                        <label htmlFor="weeks">{t('common:weeks')}</label>
                        <input type="number" required id="weeks" className="form-control"  value={this.state.course.weeks} onChange={(e)=>this.handleInput('weeks', e)} />
                    </div>
                    <div className="form-group col-md-3 col-sm-6">
                        <label htmlFor="duration">{t('courses:lessonDuration')}</label>
                        <input type="number" required id="duration" className="form-control" value={this.state.course.durationMinutes} onChange={(e)=>this.handleInput('durationMinutes', e)} />
                    </div>
                </div>
                <div className="form-group">
                    {uiState === UISTATE_SAVE_FAILED && <div className="alert alert-danger">{t('common:errorSaving')}</div>}
                    <button type="submit" className={uiState === UISTATE_SAVED ? "btn btn-success" : "btn btn-primary"}>{buttonText}</button>
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

export default withNamespaces()(CourseEditor);