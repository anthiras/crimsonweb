import React from 'react';
import UserRow from "./UserRow";
import { Loading, Pagination } from './Utilities';
import { withTranslation } from 'react-i18next';

const UserTable = ({ t, users, page, lastPage, roles, setMembershipPaid, toggleUserRole }) => {
    if (!users || !roles) return <Loading />;
    return (
        <React.Fragment>
        <table className="table">
            <thead>
                <tr>
                    <th width="50"></th>
                    <th>{t('common:name')}</th>
                    <th>{t('users:roles')}</th>
                    <th>{t('titles:membership')}</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user =>
                    <UserRow key={user.id} user={user} allRoles={roles} setMembershipPaid={setMembershipPaid} toggleUserRole={toggleUserRole} />
                )}
            </tbody>
        </table>
        <Pagination page={page} lastPage={lastPage} urlForPage={(page) => '/users/'+page} />
        </React.Fragment>
    );
}

export default withTranslation()(UserTable);