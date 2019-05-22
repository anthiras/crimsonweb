import {
    REQUEST_PROFILE, RECEIVE_PROFILE, SUBMIT_PROFILE, SUBMIT_PROFILE_SUCCESS, SUBMIT_PROFILE_ERROR,
    EDIT_PROFILE_FIELD, RECEIVE_USERS, RECEIVE_ROLES, SET_MEMBERSHIP_PAID_SUCCESS, TOGGLE_USER_ROLE_SUCCESS,
    REQUEST_PERMISSIONS, REQUEST_PERMISSIONS_SUCCESS, REQUEST_PERMISSIONS_ERROR, INVALIDATE_PERMISSIONS
} from '../actions/users'
import {
    SUBMIT_MEMBERSHIP, SUBMIT_MEMBERSHIP_SUCCESS, SUBMIT_MEMBERSHIP_ERROR
} from '../actions/membership'
import { resolveUiState } from '../shared/uiState'

export function profile(state = {
    uiState: null,
    user: null
}, action)
{
    switch (action.type) {
        case REQUEST_PROFILE:
            // fall through
        case SUBMIT_PROFILE:
            // fall through
        case SUBMIT_PROFILE_ERROR:
            return Object.assign({}, state, {
                uiState: resolveUiState(action.type)
            })
        case RECEIVE_PROFILE:
            return Object.assign({}, state, {
                uiState: 'ready',
                user: action.response
            })
        case SUBMIT_PROFILE_SUCCESS:
            return Object.assign({}, state, {
                uiState: 'saved',
                user: action.user
            })
        case EDIT_PROFILE_FIELD:
            return Object.assign({}, state, {
                uiState: null
            })
        case SUBMIT_MEMBERSHIP:
            return Object.assign({}, state, {
                membershipUiState: resolveUiState(action.type)
            })
        case SUBMIT_MEMBERSHIP_ERROR:
            return Object.assign({}, state, {
                membershipUiState: resolveUiState(action.type)
            })
        case SUBMIT_MEMBERSHIP_SUCCESS:
            return Object.assign({}, state, {
                user: Object.assign({}, state.user, { currentMembership: action.membership }),
                membershipUiState: resolveUiState(action.type)
            })
        default:
            return state;
    }
}

function usersByPage(state = {}, action) {
    switch (action.type) {
        case RECEIVE_USERS:
            return Object.assign({}, state, {
                [action.page]: action.response.data.map(x => x.id)
            })
        default:
            return state;
    }
}

function usersById(state = {}, action) {
    switch (action.type) {
        case RECEIVE_USERS:
            return action.response.data.reduce((state, obj) => {
                state[obj.id] = obj;
                return state;
            }, state);
        case SET_MEMBERSHIP_PAID_SUCCESS:
            state[action.userId].currentMembership = action.response;
            return state;
        case TOGGLE_USER_ROLE_SUCCESS:
            if (action.userHasRole)
                state[action.userId].roles.push({ id: action.roleId })
            else
                state[action.userId].roles = state[action.userId].roles.filter(role => role.id !== action.roleId)
            return state;
        default:
            return state;
    }
}

export function users(state = {
    usersById: {},
    usersByPage: {}
}, action) {
    switch (action.type) {
        case RECEIVE_USERS:
            return Object.assign({}, state, {
                usersByPage: usersByPage(state.usersByPage, action),
                lastPage: action.response.meta.last_page,
                usersById: usersById(state.usersById, action)
            })
        case SET_MEMBERSHIP_PAID_SUCCESS:
            // fall through
        case TOGGLE_USER_ROLE_SUCCESS:
            return Object.assign({}, state, {
                usersById: usersById(state.usersById, action)
            })
        default:
            return state;
    }
}

export function roles(state = null, action) {
    switch (action.type) {
        case RECEIVE_ROLES:
            return action.response
        default:
            return state;
    }
}

export function permissions(state = {
    items: null,
    isFetching: false
}, action) {
    switch (action.type) {
        case REQUEST_PERMISSIONS:
            return Object.assign({}, state, {
                isFetching: true
            })
        case REQUEST_PERMISSIONS_SUCCESS:
            return Object.assign({}, state, {
                    isFetching: false,
                    items: action.response
                })
        case REQUEST_PERMISSIONS_ERROR:
            return Object.assign({}, state, {
                isFetching: false
            })
        case INVALIDATE_PERMISSIONS:
            return {
                isFetching: false,
                items: null
            };
        default:
            return state;
    }
}