import React, {Component} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheckCircle, faClock } from "@fortawesome/free-solid-svg-icons/index";
import { Loading } from './Utilities';
import { withNamespaces } from 'react-i18next';
import UserProfile from './UserProfile';

class Membership extends Component
{
    constructor(props) {
        super(props);
        this.paymentOptions = JSON.parse(process.env.REACT_APP_PAYMENT_OPTIONS);
        this.state = {
            displayProfile: false,
            signupComment: "",
            paymentMethod: this.paymentOptions[0]
        }
        this.register = this.register.bind(this);
        this.setSignupComment = this.setSignupComment.bind(this);
        this.displayProfile = this.displayProfile.bind(this);
    }

    register() {
        this.props.submitMembership({ 
                userId: this.props.profile.user.id, 
                signupComment: this.state.signupComment,
                paymentMethod: this.state.paymentMethod 
            });
    }

    setSignupComment(value) {
        this.setState({signupComment: value});
    }

    setPaymentMethod(value) {
        this.setState({paymentMethod: value});
    }

    displayProfile() {
        this.setState({displayProfile: true});
    }

    render() {
        const { t, profile, currentMembershipPeriod } = this.props;
        const user = profile.user;

        if (user == null || currentMembershipPeriod == null) {
            return <Loading />;
        }

        const membership = user.currentMembership;
        const lastRenewal = new Date(currentMembershipPeriod.lastRenewal);
        const nextRenewal = new Date(currentMembershipPeriod.nextRenewal)

        const infoCompleted = user != null &&
            user.gender != null &&
            user.birthDate != null;

        let step = 0;
        if (infoCompleted) {
            step = 1;
            if (membership != null) {
                step = 2;
                if (membership.paidAt != null) {
                    step = 3;
                }
            }
        }
        const successClass = "card text-white bg-success mb-2";
        const defaultClass = "card mb-2";
        return (
            <div>
                <h1>{ t('titles:membership') }</h1>
                {this.state.currentPeriod && <p>{ t('membership:period', { lastRenewal, nextRenewal }) }</p>}
                <div className={step >= 1 ? successClass : defaultClass}>
                    <div className="card-body">
                        <h5 className="card-title">{t('membership:step1UserDetails')}</h5>
                        {step >= 1 && <p>
                            <FontAwesomeIcon icon={faCheckCircle} size="lg"/>
                            <span> {t('membership:infoOk')}</span>
                        </p>}
                        {step === 0 &&
                            <React.Fragment>
                                <p>{t('membership:weeNeedAFewDetails')}</p>
                                {!this.state.displayProfile && <button className="btn btn-primary" onClick={this.displayProfile}>{t('actions:fillOutYourInfo')}</button>}
                                {this.state.displayProfile && !infoCompleted && <UserProfile user={user} uiState={profile.uiState} submitProfile={this.props.submitProfile} editProfileField={this.props.editProfileField} />}
                            </React.Fragment>}
                    </div>
                </div>
                <div className={step >= 2 ? successClass : defaultClass}>
                    <div className="card-body">
                        <h5 className="card-title">{t('membership:step2Register')}</h5>
                        {step >= 2 && <p>
                            <FontAwesomeIcon icon={faCheckCircle} size="lg"/>
                            <span> {t('membership:registrationReceived')}</span>
                        </p>}
                        {step === 1 &&
                            <React.Fragment>
                                <p>{ t('membership:yourRegistrationWillBeValidUntilX', { nextRenewal }) }</p>
                                <p>{t('membership:registrationInstructions')}</p>
                                <div className="form-group">
                                    <label>{t('membership:payment')}</label>
                                    {this.paymentOptions.map(payment => 
                                        <div className="form-check" key={payment}>
                                            <input className="form-check-input" type="radio" name="payment" value={payment} id={"payment_"+payment} onChange={(e) => this.setPaymentMethod(e.target.value)} required />
                                            <label className="form-check-label" htmlFor={"payment_"+payment}>{t('membership:paymentNames:'+payment)}</label>
                                        </div>
                                        )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="signupComment">{t('membership:signupComment')}</label>
                                    <input type="text" required id="signupComment" className="form-control" value={this.state.signupComment} 
                                        onChange={(e)=>this.setSignupComment(e.target.value)} />
                                </div>
                                <button type="button" className="btn btn-primary" onClick={this.register}>{t('actions:registerNow')}</button>
                            </React.Fragment>}
                    </div>
                </div>
                <div className={step >= 3 ? successClass : defaultClass}>
                    <div className="card-body">
                        <h5 className="card-title">{t('membership:step3Payment')}</h5>
                        {step >= 3 && <p>
                            <FontAwesomeIcon icon={faCheckCircle} size="lg"/>
                            <span> {t('membership:completed')}</span>
                        </p>}
                        {step === 2 && 
                            <React.Fragment>
                                <p><FontAwesomeIcon icon={faClock} size="lg"/><span> {t('membership:paymentPending')}</span></p>
                                <p>{t('membership:paymentInstructions')}</p>
                            </React.Fragment>}
                    </div>
                </div>
            </div>
        )
    }
}

export default withNamespaces()(Membership);