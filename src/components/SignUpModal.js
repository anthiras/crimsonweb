import React, {Component} from "react";
import Modal from 'react-bootstrap4-modal';
import { withTranslation } from 'react-i18next';

class SignUpModal extends Component
{
    constructor(props) {
        super(props);
        
        this.submitSignup = this.submitSignup.bind(this);
        this.setRole = this.setRole.bind(this);
        this.state = {
            role: null
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.course.showSignupModal && !prevProps.course.showSignupModal && this.state.role == null) {
            this.setState({role: window.localStorage.getItem('participantRole')});
        }
    }

    setRole(role) {
        this.setState({role: role});
        window.localStorage.setItem('participantRole', role);
    }

    submitSignup(e) {
        e.preventDefault();
        this.props.signup(this.props.course.id, { role: this.state.role });
    }

    render() {
        const { t, course, close } = this.props;
        const modalId = "signup" + course.id;
        const role = this.state.role;

        return <Modal visible={course.showSignupModal || false} onClickBackdrop={close}>
            <form onSubmit={this.submitSignup}>
                <div className="modal-header">
                    <h5 className="modal-title">{t('courses:signupFor')} {course.name}</h5>
                    <button type="button" className="close" aria-label="Close" onClick={close}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="role" id={modalId + "_lead"}
                               value="lead" onChange={(e) => this.setRole('lead')} checked={role === "lead"} required />
                        <label className="form-check-label" htmlFor={modalId + "_lead"}>{t('courses:lead')}</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="role"
                               id={modalId + "_follow"}
                               value="follow" onChange={(e) => this.setRole('follow')} checked={role === "follow"} required />
                        <label className="form-check-label" htmlFor={modalId + "_follow"}>{t('courses:follow')}</label>
                    </div>
                    {course.signupError && <div className="alert alert-danger">{t('courses:signupError')}</div>}
                </div>
                <div className="modal-footer">
                    <button type="button" onClick={close} className="btn btn-secondary">{t('common:cancel')}
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={course.signupProcessing}>{course.signupProcessing ? t('common:saving') : t('actions:confirmSignup')}</button>
                </div>
            </form>
        </Modal>
    }
}

export default withTranslation()(SignUpModal);