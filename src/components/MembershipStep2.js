import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import MembershipStep from "./MembershipStep";
import useMembershipActions from "../actions/membership";
import { UISTATE_SAVED, UISTATE_SAVING } from '../shared/uiState'

const PAYMENT_OPTIONS = JSON.parse(process.env.REACT_APP_PAYMENT_OPTIONS);

const MembershipStep2 = ({ t, isCompleted, profile, isActive, nextRenewal }) => {
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_OPTIONS[0]);

    const { submitMembership } = useMembershipActions();

    const register = () => submitMembership({ 
        userId: profile.user.id, 
        signupComment: null,
        paymentMethod: paymentMethod 
    });

    const registerMembershipButtonText =
        profile.membershipUiState === UISTATE_SAVING ? t('common:saving') :
        profile.membershipUiState === UISTATE_SAVED ? t('common:saved') :
            t('actions:registerNow');

    return <MembershipStep 
        isCompleted={isCompleted}
        title={t('membership:step2Register')}
        completedMessage={t('membership:registrationReceived')}>
        {isActive && <React.Fragment>
            <p>{ t('membership:yourRegistrationWillBeValidUntilX', { nextRenewal }) }</p>
            <p>{t('membership:registrationInstructions')}</p>
            <Form.Group>
                <Form.Label>{t('membership:payment')}</Form.Label>
                {PAYMENT_OPTIONS.map(payment => 
                    <Form.Check 
                        key={payment}
                        label={t('membership:paymentNames:'+payment)}
                        type="radio"
                        name="payment"
                        value={payment}
                        id={"payment_"+payment}
                        checked={paymentMethod === payment}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required />
                    )}
            </Form.Group>
            <Button variant="primary" onClick={register} disabled={profile.membershipUiState===UISTATE_SAVING}>{registerMembershipButtonText}</Button>
        </React.Fragment>}
    </MembershipStep>;
};

export default MembershipStep2;