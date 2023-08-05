import React from 'react';
import UserRow from "./UserRow";
import UserNavigation from './UserNavigation';
import { Loading, Pagination } from './Utilities';
import { withTranslation } from 'react-i18next';
import history from '../shared/History';

const UserTable = ({ t, users, list, page, lastPage, roles, setMembershipPaid, toggleUserRole, query }) => {
    if (!users || !roles) return <Loading />;
    return (
        <React.Fragment>
        <UserNavigation query={query} />
        <input type="text" className="form-control" value={query} onChange={(e) => history.push('?query=' + encodeURIComponent(e.target.value))} placeholder={t('common:search')} />
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
        <Pagination page={page} lastPage={lastPage} urlForPage={(page) => '/users/'+list+'/'+page+'?query='+encodeURIComponent(query)} />
        </React.Fragment>
    );
}

export default withTranslation()(UserTable);