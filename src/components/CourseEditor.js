import React, { Component } from 'react';
import { post, get, put } from './Api';
import AsyncSelect from 'react-select/lib/Async';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import { Loading } from './Utilities';

class CourseEditor extends Component {
	constructor(props) {
		super(props);
        this.state = { course: null };
        
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}

    componentDidMount() {
        if (this.props.match.params.courseId) {
            get('/v1/courses/'+this.props.match.params.courseId).then(course => {
                this.setState({ course: this.mapToState(course) });
            });
        } else {
            this.setState({
                course: {
                    id: null,
                    name: 'New course',
                    startsAtDate: '2018-01-01',
                    startsAtTime: '08:00:00',
                    weeks: 8,
                    durationMinutes: 60,
                    instructors: [] 
                }
            });
        }
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
	}

	handleSubmit(e) {
		e.preventDefault();

		let data = this.mapStateToData();

        console.log(data);

        if (this.courseId) {
            put('/v1/courses/'+this.courseId, data)
                .then(() => { window.location.href='/courses/'+this.courseId; });
        } else {
            post('/v1/courses', data)
                .then(() => { window.location.href='/courses/'+data.id; });
        }
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
        if (this.state.course == null)
            return <Loading />;
	    const t = this.props.t;
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
                <button type="submit" className="btn btn-primary">{t('actions:saveCourse')}</button>
            </form>
        );
	}
}

export default withNamespaces()(CourseEditor);