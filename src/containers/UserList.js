import React, { Component } from 'react';
import {
  fetchUsersIfNeeded,
  fetchRolesIfNeeded,
  setMembershipPaid,
  toggleUserRole,
  fetchPermissions
} from '../actions/users'
import { connect } from 'react-redux'
import UserTable from '../components/UserTable'
import { Loading } from '../components/Utilities';

class UserList extends Component
{
	componentDidMount() {
		this.props.fetchUsersIfNeeded(this.props.list, this.props.page, this.props.query)
		this.props.fetchRolesIfNeeded()
		this.props.fetchPermissions()
	}

	componentDidUpdate(prevProps) {
		if (this.props.page !== prevProps.page || this.props.list !== prevProps.list || this.props.query !== prevProps.query || this.props.invalidated !== prevProps.invalidated) {
			this.props.fetchUsersIfNeeded(this.props.list, this.props.page, this.props.query)
		}
	}

	render() {
		const { users, roles, list, page, lastPage, setMembershipPaid, toggleUserRole, permissions, query } = this.props;
		if (!users || !roles || !permissions) 
			return <Loading />;
		if (!permissions['users:list'] || !permissions['roles:assignRole:instructor'])
			throw new Error('Insufficient permissions');
		return (<UserTable users={users} roles={roles} page={page} lastPage={lastPage} list={list} setMembershipPaid={setMembershipPaid} toggleUserRole={toggleUserRole} query={query} />)
	}
}

function mapStateToProps(state, ownProps) {
	const { users, roles, permissions } = state;
	const page = parseInt(ownProps.match.params.page || 1);
	const list = ownProps.match.params.list || 'all';
	const searchParams = new URLSearchParams(ownProps.location.search);
	const query = searchParams.get('query');
	const userList = users.userLists[list];
	const pageLoaded = page in userList.pages;
	const invalidated = userList.invalidated;
	const usersOnCurrentPage = pageLoaded ? userList.pages[page].userIds.map(userId => users.usersById[userId]) : [];

	return { 
		users: usersOnCurrentPage, 
		list: list,
		page: page,
		invalidated: invalidated,
		lastPage: userList.lastPage,
		roles: roles,
		permissions: permissions.items,
		query: query }
}

const actionCreators = {
	fetchUsersIfNeeded,
	fetchRolesIfNeeded,
	setMembershipPaid,
	toggleUserRole,
	fetchPermissions
}

export default connect(mapStateToProps, actionCreators)(UserList);