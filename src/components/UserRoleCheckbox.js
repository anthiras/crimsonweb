import React from 'react';
import { withTranslation } from 'react-i18next';

const UserRoleCheckbox = ({ t, userRole, toggleUserRole }) => {
    const checkboxId = userRole.userId + '_' + userRole.roleId;
    return (
        <div className="form-check">
            <input className="form-check-input" type="checkbox" id={checkboxId}
                   checked={userRole.userHasRole} onChange={() => toggleUserRole(userRole.userId, userRole.roleId, !userRole.userHasRole)} />
            <label className="form-check-label" htmlFor={checkboxId}>{t('roles:names:'+userRole.name)}</label>
        </div>
    )
}

export default withTranslation()(UserRoleCheckbox);