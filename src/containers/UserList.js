import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useUserActions from '../actions/users'
import { useSelector } from 'react-redux'
import UserTable from '../components/UserTable'
import { Loading } from '../components/Utilities';
import { selectUsersOnListAndPage } from '../reducers/users';

const UserList = () => {
	let { list, page } = useParams();
	page = page ? parseInt(page) : 1;

	const { fetchUsersIfNeeded, fetchRolesIfNeeded, fetchPermissions } = useUserActions();

	const { users, lastPage } = useSelector((state) => selectUsersOnListAndPage(state, list, page));
	const roles = useSelector((state) => state.roles);
	const permissions = useSelector((state) => state.permissions.items);

	useEffect(() => {
		fetchUsersIfNeeded(list, page);
		fetchRolesIfNeeded();
		fetchPermissions();
	}, [list, page, fetchUsersIfNeeded, fetchRolesIfNeeded, fetchPermissions]);

	if (!users || !roles || !permissions) 
		return <Loading />;
	if (!permissions['users:list'] || !permissions['roles:assignRole:instructor'])
		throw new Error('Insufficient permissions');
	return <UserTable users={users} list={list} page={page} lastPage={lastPage} roles={roles} />;
};

export default UserList;
