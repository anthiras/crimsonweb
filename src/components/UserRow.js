import React from 'react';
import UserRoleCheckbox from './UserRoleCheckbox';
import { withTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons/index";
import { formatDate, parseUtcDate } from '../shared/DateUtils';
import useUserActions from '../actions/users';
import usePermissions from '../hooks/usePermissions';

const UserRow = ({ t, user, allRoles }) => {
    const { setMembershipPaid } = useUserActions();
    const permissions = usePermissions();

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
            <td>{user.email}</td>
            <td>
                {roles.map(userRole => {
                    return (
                        <UserRoleCheckbox key={userRole.roleId} userRole={userRole} />
                    );
                })}
            </td>
            <td>
                {memberNotPaid && permissions['membership:setPaid'] && 
                    <Button variant="primary" onClick={() => setMembershipPaid(user.id)}>{t('common:approve')} {membership.paymentMethod} {formatDate(parseUtcDate(membership.createdAt))}</Button>
                }
                {memberNotPaid && !permissions['membership:setPaid'] && t('users:membershipRegistered')}
                {memberPaid && <FontAwesomeIcon icon={faCheckCircle} size="lg" className="text-success"/>}
            </td>
        </tr>
    );
}

export default withTranslation()(UserRow);