import React from 'react';
import UserRow from "./UserRow";
import UserNavigation from './UserNavigation';
import { Loading, Pagination } from './Utilities';
import { withTranslation } from 'react-i18next';

const UserTable = ({ t, users, list, page, lastPage, roles, setMembershipPaid, toggleUserRole }) => {
    if (!users || !roles) return <Loading />;
    return (
        <React.Fragment>
        <UserNavigation />
        <table className="table">
            <thead>
                <tr>
                    <th width="50"></th>
                    <th>{t('common:name')}</th>
                    <th>{t('common:email')}</th>
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
        <Pagination page={page} lastPage={lastPage} urlForPage={(page) => '/users/'+list+'/'+page} />
        </React.Fragment>
    );
}

export default withTranslation()(UserTable);