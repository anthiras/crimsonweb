import { get, put, post, del } from '../shared/Api'
import Auth from '../shared/Auth'

export const REQUEST_PROFILE = 'REQUEST_PROFILE'
export const RECEIVE_PROFILE = 'RECEIVE_PROFILE'
export const REQUEST_PROFILE_ERROR = 'REQUEST_PROFILE_ERROR'
export const EDIT_PROFILE_FIELD = 'EDIT_PROFILE_FIELD'
export const SUBMIT_PROFILE = 'SUBMIT_PROFILE'
export const SUBMIT_PROFILE_SUCCESS = 'SUBMIT_PROFILE_SUCCESS'
export const SUBMIT_PROFILE_ERROR = 'SUBMIT_PROFILE_ERROR'
export const REQUEST_USERS = 'REQUEST_USERS'
export const RECEIVE_USERS = 'RECEIVE_USERS'
export const REQUEST_USERS_ERROR = 'REQUEST_USERS_ERROR'
export const REQUEST_ROLES = 'REQUEST_ROLES'
export const RECEIVE_ROLES = 'RECEIVE_ROLES'
export const RECEIVE_ROLES_ERROR = 'RECEIVE_ROLES_ERROR'
export const SET_MEMBERSHIP_PAID = 'SET_MEMBERSHIP_PAID'
export const SET_MEMBERSHIP_PAID_SUCCESS = 'SET_MEMBERSHIP_PAID_SUCCESS'
export const SET_MEMBERSHIP_PAID_ERROR = 'SET_MEMBERSHIP_PAID_ERROR'
export const TOGGLE_USER_ROLE = 'TOGGLE_USER_ROLE'
export const TOGGLE_USER_ROLE_SUCCESS = 'TOGGLE_USER_ROLE_SUCCESS'
export const TOGGLE_USER_ROLE_ERROR = 'TOGGLE_USER_ROLE_ERROR'
export const REQUEST_PERMISSIONS = 'REQUEST_PERMISSIONS'
export const REQUEST_PERMISSIONS_SUCCESS = 'REQUEST_PERMISSIONS_SUCCESS'
export const REQUEST_PERMISSIONS_ERROR = 'REQUEST_PERMISSIONS_ERROR'
export const INVALIDATE_PERMISSIONS = 'INVALIDATE_PERMISSIONS'
export const DELETE_USER = 'DELETE_USER'
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS'
export const DELETE_USER_ERROR = 'DELETE_USER_ERROR'

function shouldFetchProfile(state) {
  const profile = state.profile.user
  if (!profile) {
    return true
  } else if (profile.isFetching) {
    return false
  } else {
    return profile.didInvalidate
  }
}

export const fetchProfileIfNeeded = () => ({
	types: [REQUEST_PROFILE, RECEIVE_PROFILE, REQUEST_PROFILE_ERROR],
	shouldCallApi: shouldFetchProfile,
	callApi: () => get('/v1/users/current')
})

export const editProfileField = () => ({
	type: EDIT_PROFILE_FIELD
})

export const submitProfile = user => ({
	types: [SUBMIT_PROFILE, SUBMIT_PROFILE_SUCCESS, SUBMIT_PROFILE_ERROR],
	callApi: () => put('/v1/users/'+user.id, user),
	payload: { user }
})

const userListUrl = (list, page, query) => {
	let url = '/v1/users?include[]=roles&include[]=memberships'
	if (list === 'members')
		url += '&isMember=true';
	if (list === 'paid')
		url += '&isPaidMember=true';
	if (list === 'unpaid')
		url += '&isMember=true&isPaidMember=false';
	if (query)
		url += '&query=' + encodeURIComponent(query);
	url += '&page=' + page;
	return url;
}

export const fetchUsersIfNeeded = (list, page, query) => ({
	types: [REQUEST_USERS, RECEIVE_USERS, REQUEST_USERS_ERROR],
	shouldCallApi: state => { 
		let userList = state.users.userLists[list];
		return !userList.pages[page] || userList.invalidated || userList.pages[page].query !== query;
	},
	callApi: () => get(userListUrl(list, page, query)),
	payload: { list, page, query }
})

export const fetchRolesIfNeeded = () => ({
	types: [REQUEST_ROLES, RECEIVE_ROLES, RECEIVE_ROLES_ERROR],
	shouldCallApi: state => !state.roles,
	callApi: () => get('/v1/roles')
})

export const setMembershipPaid = userId => ({
	types: [SET_MEMBERSHIP_PAID, SET_MEMBERSHIP_PAID_SUCCESS, SET_MEMBERSHIP_PAID_ERROR],
	callApi: () => post('/v1/membership/'+userId+'/setPaid'),
	payload: { userId }
})

export const toggleUserRole = (userId, roleId, userHasRole) => ({
	types: [TOGGLE_USER_ROLE, TOGGLE_USER_ROLE_SUCCESS, TOGGLE_USER_ROLE_ERROR],
	callApi: userHasRole
		? () => post('/v1/users/' + userId + '/roles/' + roleId)
		: () => del('/v1/users/' + userId + '/roles/' + roleId),
	payload: { userId, roleId, userHasRole }
})

export const fetchPermissions = (forceRefresh = false) => ({
	types: [REQUEST_PERMISSIONS, REQUEST_PERMISSIONS_SUCCESS, REQUEST_PERMISSIONS_ERROR],
	shouldCallApi: state => (!state.permissions.items && !state.permissions.isFetching) || forceRefresh,
	callApi: () => get('/v1/users/current/permissions')
})

export const invalidatePermissions = () => ({
	type: INVALIDATE_PERMISSIONS
})

export const deleteUser = userId => ({
	types: [DELETE_USER, DELETE_USER_SUCCESS, DELETE_USER_ERROR],
	callApi: () => del('/v1/users/'+userId),
	payload: { userId },
	onSuccess: () => {
		let auth = new Auth();
		auth.logout();
	}
})
