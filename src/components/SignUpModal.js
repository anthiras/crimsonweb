import React, {Component} from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
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

        return <Modal show={course.showSignupModal || false} onHide={close}>
            <Form onSubmit={this.submitSignup}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('courses:signupFor')} {course.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>{t('courses:role')}</Form.Label>
                        <Form.Check type="radio" label={t('courses:lead')} name="role" id={modalId + "_lead"} checked={role === "lead"} required onChange={(e) => this.setRole('lead')} value="lead" />
                        <Form.Check type="radio" label={t('courses:follow')} name="role" id={modalId + "_follow"} checked={role === "follow"} required onChange={(e) => this.setRole('follow')} value="follow" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>{t('courses:terms')}</Form.Label>
                        <Form.Check type="checkbox">
                            <Form.Check.Input type="checkbox" name="acceptTerms" value="true" id={modalId + "_acceptTerms"} required />
                            <Form.Check.Label>{t('courses:iAcceptThe')} <a href={process.env.REACT_APP_TERMS} target="_blank" rel="noopener noreferrer">{t('courses:registrationTerms')}</a> {t('courses:andThe')} <a href={process.env.REACT_APP_PRIVACY_POLICY} target="_blank" rel="noopener noreferrer">{t('courses:privacyPolicy')}</a>.</Form.Check.Label>
                        </Form.Check>
                    </Form.Group>
                    {course.signupError && <Alert variant="danger">{t('courses:signupError')}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={close}>{t('common:cancel')}</Button>
                    <Button variant="primary" type="submit" disabled={course.signupProcessing}>{course.signupProcessing ? t('common:saving') : t('actions:confirmSignup')}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    }
}

export default withTranslation()(SignUpModal);