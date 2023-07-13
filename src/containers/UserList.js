import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useUserActions from '../actions/users'
import { useSelector } from 'react-redux'
import UserTable from '../components/UserTable'
import { Loading } from '../components/Utilities';

function mapStateToProps(state, ownProps) {
	const { users, roles, permissions } = state;
	const page = parseInt(ownProps.page || 1);
	const list = ownProps.list || 'all';
	const userList = users.userLists[list];
	const pageLoaded = page in userList.pages;
	const invalidated = userList.invalidated;
	const usersOnCurrentPage = pageLoaded ? userList.pages[page].map(userId => users.usersById[userId]) : [];

	return { 
		users: usersOnCurrentPage, 
		list: list,
		page: page,
		invalidated: invalidated,
		lastPage: userList.lastPage,
		roles: roles,
		permissions: permissions.items }
}

const UserList = () => {
	let { list, page } = useParams();
	page = page ? parseInt(page) : 1;

	const { fetchUsersIfNeeded, fetchRolesIfNeeded, fetchPermissions } = useUserActions();
	const props = useSelector((state) => mapStateToProps(state, { list, page }));

	useEffect(() => {
		fetchUsersIfNeeded(list, page);
		fetchRolesIfNeeded();
		fetchPermissions();
	}, [list, page]);

	if (!props.users || !props.roles || !props.permissions) 
		return <Loading />;
	if (!props.permissions['users:list'] || !props.permissions['roles:assignRole:instructor'])
		throw new Error('Insufficient permissions');
	return <UserTable {...props} list={list} page={page} />;
};

export default UserList;
