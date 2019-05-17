import React, { Component } from 'react';
import { Loading, DatePicker } from './Utilities';
import { ConfirmModal } from './ConfirmModal';
import { withTranslation } from 'react-i18next';
import { UISTATE_SAVED, UISTATE_SAVE_FAILED, UISTATE_SAVING } from '../shared/uiState'

class UserProfile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: this.props.user,
            deleteModalVisible: false
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInput = this.handleInput.bind(this);
        this.handleBirthDate = this.handleBirthDate.bind(this);
        this.setProfileField = this.setProfileField.bind(this);
        this.openDeleteModal = this.openDeleteModal.bind(this);
        this.closeDeleteModal = this.closeDeleteModal.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
	}

	handleInput(key, e) {
	    var value = e.target === undefined ? e : e.target.value;
        this.setProfileField(key, value);
	}

    handleBirthDate(value) {
        this.setProfileField('birthDate', value);
    }

    setProfileField(key, value) {
        var state = Object.assign({}, this.state.user);
        state[key] = value;
        this.setState({ user: state });
        this.props.editProfileField();
    }

	handleSubmit(e) {
		e.preventDefault();
        this.props.submitProfile(this.state.user);
	}

    openDeleteModal() {
        this.setState({deleteModalVisible: true})
    }

    closeDeleteModal() {
        this.setState({deleteModalVisible: false})
    }

    confirmDelete() {
        this.closeDeleteModal();
        this.props.deleteUser(this.state.user.id);
    }

	render() {
        const { t, uiState } = this.props;

        if (this.state.user == null) {
            return <Loading />;
        }
        const { name, birthDate, gender, email } = this.state.user;
        console.log("render birthDate", birthDate)
        const buttonText =
            uiState === UISTATE_SAVING ? t('common:saving') :
            uiState === UISTATE_SAVED ? t('common:saved') :
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
                    <DatePicker date={birthDate} onChange={this.handleBirthDate} />
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
                    {uiState === UISTATE_SAVE_FAILED && <div className="alert alert-danger">{t('common:errorSaving')}</div>}
                    <button type="submit" className={uiState === UISTATE_SAVED ? "btn btn-success" : "btn btn-primary"}>{buttonText}</button>
                    {" "}
                    <button type="button" className="btn btn-danger" onClick={this.openDeleteModal}>{t('actions:deleteProfile')}</button>
                </div>
                <ConfirmModal 
                    visible={this.state.deleteModalVisible} 
                    onConfirm={this.confirmDelete}
                    onCancel={this.closeDeleteModal} 
                    title={t('common:pleaseConfirm')} 
                    confirmText={t('common:delete')} 
                    cancelText={t('common:cancel')} >
                    {t('users:confirmDeleteProfile')}
                </ConfirmModal>
            </form>
        );
	}
}

export default withTranslation()(UserProfile);