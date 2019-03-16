import React from 'react';
import UserRoleCheckbox from './UserRoleCheckbox';
import { withTranslation } from 'react-i18next';

const UserRow = ({ t, user, allRoles, setMembershipPaid, toggleUserRole }) => {
    const membership = user.currentMembership;
    const memberNotPaid = membership != null && membership.paidAt == null;
    const memberPaid = membership != null && membership.paidAt != null;
    const roles = allRoles.map(role => ({
            userId: user.id,
            roleId: role.id,
            name: role.name,
            userHasRole: user.roles.find((r) => { return r.id === role.id; }) !== undefined
        }))
    return (
        <tr>
            <td><img src={user.picture} width="50" height="50" alt="" /></td>
            <td>{user.name}</td>
            <td>
                {roles.map(userRole => {
                    return (
                        <UserRoleCheckbox key={userRole.roleId} userRole={userRole} toggleUserRole={toggleUserRole} />
                    );
                })}
            </td>
            <td>
                {memberNotPaid && <button type="button" className="btn btn-primary" onClick={() => setMembershipPaid(user.id)}>{t('actions:confirmPayment')}</button> }
                {memberPaid && t('users:membershipPaid')}
            </td>
        </tr>
    );
}

export default withTranslation()(UserRow);