import React, { Component } from 'react';
import { put, get } from './Api';
import { Loading } from './Utilities';
import { withNamespaces } from 'react-i18next';

class UserProfile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: this.props.user,
            uiState: this.props.user == null ? 'loading' : 'ready'
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}

    componentDidMount() {
        if (this.state.user == null)
        {
    	    this.setState({uiState: 'loading'});
            get('/v1/users/current').then(user => {
                this.setState({ user });
                this.setState({uiState: 'ready'});
            });
        }
    }

	handleInput(key, e) {
	    var value = e.target === undefined ? e : e.target.value;
		var state = Object.assign({}, this.state.user);
    	state[key] = value;
    	this.setState({user: state, uiState: 'ready' });
	}

	handleSubmit(e) {
		e.preventDefault();

        this.setState({uiState: 'saving'});

		let data = {
			name: this.state.user.name,
			birthDate: this.state.user.birthDate,
			gender: this.state.user.gender
		};

        put('/v1/users/'+this.state.user.id, data)
            .then(() => {
                this.setState({uiState: 'saved'});
                if (this.props.onSave) {
                    this.props.onSave(this.state.user);
                }
            })
            .catch(() => this.setState({uiState: 'error'}));
	}

	render() {
        const t = this.props.t;

        if (this.state.user == null) {
            return <Loading />;
        }
        const { name, birthDate, gender, email } = this.state.user;
        const uiState = this.state.uiState;
        const buttonText =
            uiState === 'saving' ? t('common:saving') :
            uiState === 'saved' ? t('common:saved') :
                t('actions:saveInfo');
		return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">{t('common:name')}</label>
                    <input type="text" required id="name" className="form-control" value={name} onChange={(e)=>this.handleInput('name', e)} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">{t('common:email')}</label>
                    <input type="text" readOnly className="form-control-plaintext" value={email} />
                </div>
                <div className="form-group">
                    <label htmlFor="birthDate">{t('users:birthDate')}</label>
                    <input type="date" required id="birthDate" className="form-control" value={birthDate} onChange={(e)=>this.handleInput('birthDate', e)} />
                </div>
                <div className="form-group">
                    <label>{t('users:gender')}</label>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="gender" id="gender_male"
                               value="male" onChange={(e) => this.handleInput('gender', e)}
                               checked={gender === "male"} required />
                        <label className="form-check-label" htmlFor="gender_male">{t('users:male')}</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="gender" id="gender_female"
                               value="female" onChange={(e) => this.handleInput('gender', e)}
                               checked={gender === "female"} required />
                        <label className="form-check-label" htmlFor="gender_female">{t('users:female')}</label>
                    </div>
                </div>
                <div className="form-group">
                    {this.state.uiState === 'error' && <div className="alert alert-danger">An error occurred while saving your information.</div>}
                    <button type="submit" className={uiState === 'saved' ? "btn btn-success" : "btn btn-primary"}>{buttonText}</button>
                </div>
            </form>
        );
	}
}

export default withNamespaces()(UserProfile);