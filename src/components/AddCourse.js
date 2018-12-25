import React, { Component } from 'react';
import { post, get } from './Api';
import AsyncSelect from 'react-select/lib/Async';
import { withNamespaces } from 'react-i18next';

class AddCourse extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newCourse: {
				name: 'New course',
				startsAtDate: '2018-01-01',
				startsAtTime: '08:00:00',
				weeks: 8,
				durationMinutes: 60,
                instructors: []
			}
		}

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}

	handleInput(key, e) {
	    var value = e.target === undefined ? e : e.target.value;
		var state = Object.assign({}, this.state.newCourse);
    	state[key] = value;
    	this.setState({newCourse: state });
	}

	handleSubmit(e) {
		e.preventDefault();

		let data = {
			name: this.state.newCourse.name,
			startsAt: this.state.newCourse.startsAtDate + " " + this.state.newCourse.startsAtTime,
			weeks: this.state.newCourse.weeks,
			durationMinutes: this.state.newCourse.durationMinutes,
            instructors: this.state.newCourse.instructors.map(user => user.value)
		};

        console.log(data);

        post('/v1/courses', data)
            .then(() => { window.location.href='/'; });
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
	    const t = this.props.t;
		return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">{t('common:name')}</label>
                    <input type="text" required id="name" className="form-control" value={this.state.newCourse.name} onChange={(e)=>this.handleInput('name', e)} />
                </div>
                <div className="form-group">
                    <label htmlFor="instructors">{t('users:instructors')}</label>
                    <AsyncSelect name="instructors" cacheOptions isMulti loadOptions={this.searchUsers} value={this.state.newCourse.instructors} onChange={(e)=>this.handleInput('instructors', e)} />
                </div>
                <div className="form-row">
                    <div className="form-group col-md-3 col-sm-6">
                        <label htmlFor="startsAt">{t('common:startDate')}</label>
                        <input type="date" required id="startsAtDate" className="form-control" value={this.state.newCourse.startsAtDate} onChange={(e)=>this.handleInput('startsAtDate', e)} />
                    </div>
                    <div className="form-group col-md-3 col-sm-6">
                        <label htmlFor="startsAt">{t('common:time')}</label>
                        <input type="time" required id="startsAtTime" className="form-control" value={this.state.newCourse.startsAtTime} onChange={(e)=>this.handleInput('startsAtTime', e)} />
                    </div>
                    <div className="form-group col-md-3 col-sm-6">
                        <label htmlFor="weeks">{t('common:weeks')}</label>
                        <input type="number" required id="weeks" className="form-control"  value={this.state.newCourse.weeks} onChange={(e)=>this.handleInput('weeks', e)} />
                    </div>
                    <div className="form-group col-md-3 col-sm-6">
                        <label htmlFor="duration">{t('courses:lessonDuration')}</label>
                        <input type="number" required id="duration" className="form-control" value={this.state.newCourse.durationMinutes} onChange={(e)=>this.handleInput('durationMinutes', e)} />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">{t('actions:saveCourse')}</button>
            </form>
        );
	}
}

export default withNamespaces()(AddCourse);