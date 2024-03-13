import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import MembershipStep from "./MembershipStep";
import UserProfile from "./UserProfile";

const MembershipStep1 = ({ t, isCompleted, profile, isActive }) => {
    const { user, uiState } = profile;
    const [displayProfile, setDisplayProfile] = useState(false);

    const infoCompleted = user != null &&
        user.gender != null &&
        user.birthDate != null;

    return <MembershipStep 
        isCompleted={isCompleted}
        title={t('membership:step1UserDetails')}
        completedMessage={t('membership:infoOk')}>
        {isActive && <React.Fragment>
            <p>{t('membership:weNeedAFewDetails')}</p>
            {!displayProfile && <Button variant="primary" onClick={() => setDisplayProfile(true)}>{t('actions:fillOutYourInfo')}</Button>}
            {displayProfile && !infoCompleted && <UserProfile user={user} uiState={uiState} allowDelete={false} />}
        </React.Fragment>}
    </MembershipStep>;
};

export default MembershipStep1;
