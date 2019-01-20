import React from 'react';

const UserRoleCheckbox = ({ userRole, toggleUserRole }) => {
    const checkboxId = userRole.userId + '_' + userRole.roleId;
    return (
        <div className="form-check">
            <input className="form-check-input" type="checkbox" id={checkboxId}
                   checked={userRole.userHasRole} onChange={() => toggleUserRole(userRole.userId, userRole.roleId, !userRole.userHasRole)} />
            <label className="form-check-label" htmlFor={checkboxId}>{userRole.name}</label>
        </div>
    )
}

export default UserRoleCheckbox;