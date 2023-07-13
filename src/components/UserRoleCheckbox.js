import React from 'react';
import { withTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import useUserActions from '../actions/users';

const UserRoleCheckbox = ({ t, userRole }) => {
    const { toggleUserRole } = useUserActions();
    const checkboxId = userRole.userId + '_' + userRole.roleId;
    return (
        <Form.Check 
            type="checkbox"
            id={checkboxId}
            checked={userRole.userHasRole} 
            onChange={() => toggleUserRole(userRole.userId, userRole.roleId, !userRole.userHasRole)} 
            label={t('roles:names:'+userRole.name)} />
    )
}

export default withTranslation()(UserRoleCheckbox);