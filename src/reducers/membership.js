import {
	REQUEST_CURRENT_MEMBERSHIP_PERIOD, RECEIVE_CURRENT_MEMBERSHIP_PERIOD
} from '../actions/membership'

export function membership(state = {}, action) {
	switch (action.type) {
		case REQUEST_CURRENT_MEMBERSHIP_PERIOD:
			return Object.assign({}, state, {
                isFetching: true
            })
		case RECEIVE_CURRENT_MEMBERSHIP_PERIOD:
			return Object.assign({}, state, {
                isFetching: false,
                currentMembershipPeriod: action.currentMembershipPeriod
            })
		default:
			return state;
	}
}