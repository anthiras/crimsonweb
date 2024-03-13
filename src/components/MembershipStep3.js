import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from "@fortawesome/free-solid-svg-icons/index";
import Alert from 'react-bootstrap/Alert'
import MembershipStep from "./MembershipStep";

const MembershipStep3 = ({ t, isCompleted, isActive, membership }) => {
    return <MembershipStep 
        isCompleted={isCompleted}
        title={t('membership:step3Payment')}
        completedMessage={t('membership:completed')}>
            {isActive && <React.Fragment>
                <p><FontAwesomeIcon icon={faClock} size="lg"/><span> {t('membership:paymentPending')}</span></p>
                <Alert variant="info">{t('membership:paymentInstructions:'+membership.paymentMethod)}</Alert>
                <p>{t('membership:paymentAdditionalInstructions')}</p>
            </React.Fragment>}
        </MembershipStep>;
};

export default MembershipStep3;
