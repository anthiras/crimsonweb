import React, {Component} from "react";
import Modal from 'react-bootstrap4-modal';
import { withNamespaces } from 'react-i18next';

class SignUpModal extends Component
{
    constructor(props) {
        super(props);
        this.modalId = "signup" + props.course.id;
        this.submitSignup = this.submitSignup.bind(this);
        this.setSignUpDetails = this.setSignUpDetails.bind(this);
        this.state = {
            signUpDetails: {
                role: null
            }
        }
    }

    setSignUpDetails(key, e) {
        var state = Object.assign({}, this.state.signUpDetails);
        state[key] = e.target.value;
        this.setState({signUpDetails: state});
    }

    submitSignup(e) {
        e.preventDefault();
        this.props.signup(this.props.course.id, this.state.signUpDetails);
    }

    render() {
        const { t, course, close, error } = this.props;

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
                        <input className="form-check-input" type="radio" name="role" id={this.modalId + "_lead"}
                               value="lead" onChange={(e) => this.setSignUpDetails('role', e)} required />
                        <label className="form-check-label" htmlFor={this.modalId + "_lead"}>{t('courses:lead')}</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="role"
                               id={this.modalId + "_follow"}
                               value="follow" onChange={(e) => this.setSignUpDetails('role', e)} required />
                        <label className="form-check-label" htmlFor={this.modalId + "_follow"}>{t('courses:follow')}</label>
                    </div>
                    {error && <div className="alert alert-danger">{t('courses:signupError')}</div>}
                </div>
                <div className="modal-footer">
                    <button type="button" onClick={close} className="btn btn-secondary">{t('common:cancel')}
                    </button>
                    <button type="submit" className="btn btn-primary">{t('actions:confirmSignup')}</button>
                </div>
            </form>
        </Modal>
    }
}

export default withNamespaces()(SignUpModal);