import React from "react";
import { withTranslation } from 'react-i18next';
import Alert from 'react-bootstrap/Alert';
import { parseUtcDate } from '../shared/DateUtils';
import { Loading } from './Utilities';
import MembershipStep1 from "./MembershipStep1";
import MembershipStep2 from "./MembershipStep2";
import MembershipStep3 from "./MembershipStep3";

const Membership = ({ t, profile, currentMembershipPeriod }) => {
    const user = profile.user;

    if (user == null || currentMembershipPeriod == null) {
        return <Loading />;
    }

    const membership = user.currentMembership;
    const lastRenewal = parseUtcDate(currentMembershipPeriod.lastRenewal);
    const nextRenewal = parseUtcDate(currentMembershipPeriod.nextRenewal);
    const open = currentMembershipPeriod.openForRegistration;

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

    return (
        <div>
            <h1>{ t('titles:membership') }</h1>
            <p>{ t('membership:period', { lastRenewal, nextRenewal }) }</p>
            <p><a href={process.env.REACT_APP_MEMBERSHIP} rel="noopener noreferrer">{t('membership:informationHere')}</a></p>
            {!open && <Alert variant="warning">{t('membership:closedForRegistration')}</Alert>}
            <MembershipStep1 t={t} isActive={open && step === 0} isCompleted={step >= 1} profile={profile} />
            <MembershipStep2 t={t} isActive={open && step === 1} isCompleted={step >= 2} profile={profile} nextRenewal={nextRenewal} />
            <MembershipStep3 t={t} isActive={open && step === 2} isCompleted={step >= 3} membership={membership} />
        </div>
    );
}

export default withTranslation()(Membership);