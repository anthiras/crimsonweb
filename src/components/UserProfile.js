import React, { Component } from 'react';
import { Loading } from './Utilities';
import { withNamespaces } from 'react-i18next';

class UserProfile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: this.props.user
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}

	handleInput(key, e) {
	    var value = e.target === undefined ? e : e.target.value;
		var state = Object.assign({}, this.state.user);
    	state[key] = value;
    	this.setState({ user: state });
        this.props.editProfileField();
	}

	handleSubmit(e) {
		e.preventDefault();
        this.props.submitProfile(this.state.user);
	}

	render() {
        const { t, uiState } = this.props;

        if (this.state.user == null) {
            return <Loading />;
        }
        const { name, birthDate, gender, email } = this.state.user;
        const buttonText =
            uiState === 'saving' ? t('common:saving') :
            uiState === 'saved' ? t('common:saved') :
                t('actions:saveInfo');

		return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">{t('common:name')}</label>
                    <input type="text" required id="name" className="form-control" value={name || ''} onChange={(e)=>this.handleInput('name', e)} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">{t('common:email')}</label>
                    <input type="text" readOnly className="form-control-plaintext" value={email || ''} />
                </div>
                <div className="form-group">
                    <label htmlFor="birthDate">{t('users:birthDate')}</label>
                    <input type="date" required id="birthDate" className="form-control" value={birthDate || ''} onChange={(e)=>this.handleInput('birthDate', e)} />
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
                    {uiState === 'error' && <div className="alert alert-danger">An error occurred while saving your information.</div>}
                    <button type="submit" className={uiState === 'saved' ? "btn btn-success" : "btn btn-primary"}>{buttonText}</button>
                </div>
            </form>
        );
	}
}

export default withNamespaces()(UserProfile);