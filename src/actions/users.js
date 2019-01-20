import { get, put, post, del } from '../components/Api'

export const REQUEST_PROFILE = 'REQUEST_PROFILE'
export const RECEIVE_PROFILE = 'RECEIVE_PROFILE'
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

const requestProfile = () => ({
	type: REQUEST_PROFILE
})

const receiveProfile = (user) => ({
	type: RECEIVE_PROFILE,
	user: user
})

const fetchProfile = () => (dispatch) => {
	dispatch(requestProfile())
	return get('/v1/users/current')
		.then(user => {
    		dispatch(receiveProfile(user))
    	});
}

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

export function fetchProfileIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchProfile(getState())) {
      return dispatch(fetchProfile())
    }
  }
}

export const editProfileField = () => ({
	type: EDIT_PROFILE_FIELD
})

const submitProfileAction = () => ({
	type: SUBMIT_PROFILE
})

const submitProfileSuccess = (user) => ({
	type: SUBMIT_PROFILE_SUCCESS,
	user: user
})

const submitProfileError = () => ({
	type: SUBMIT_PROFILE_ERROR
})

export const submitProfile = (user) => dispatch => {
	dispatch(submitProfileAction())
    put('/v1/users/'+user.id, user)
    	.then(() => dispatch(submitProfileSuccess(user)))
        .catch(() => dispatch(submitProfileError()));
}

export const fetchUsersIfNeeded = page => ({
	types: [REQUEST_USERS, RECEIVE_USERS, REQUEST_USERS_ERROR],
	shouldCallApi: state => !state.users.usersByPage[page],
	callApi: () => get('/v1/users?include[]=roles&include[]=memberships&page='+page),
	payload: { page }
})

export const fetchRolesIfNeeded = () => ({
	types: [REQUEST_ROLES, RECEIVE_ROLES, RECEIVE_ROLES_ERROR],
	shouldCallApi: state => !state.roles,
	callApi: () => get('/v1/roles')
})

export const setMembershipPaid = userId => ({
	types: [SET_MEMBERSHIP_PAID, SET_MEMBERSHIP_PAID_SUCCESS, SET_MEMBERSHIP_PAID_ERROR],
	shouldCallApi: state => true,
	callApi: () => post('/v1/membership/'+userId+'/setPaid'),
	payload: { userId }
})

export const toggleUserRole = (userId, roleId, userHasRole) => ({
	types: [TOGGLE_USER_ROLE, TOGGLE_USER_ROLE_SUCCESS, TOGGLE_USER_ROLE_ERROR],
	shouldCallApi: state => true,
	callApi: userHasRole
		? () => post('/v1/users/' + userId + '/roles/' + roleId)
		: () => del('/v1/users/' + userId + '/roles/' + roleId),
	payload: { userId, roleId, userHasRole }
})