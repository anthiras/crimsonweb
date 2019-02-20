import { get, post } from '../shared/Api'

export const REQUEST_CURRENT_MEMBERSHIP_PERIOD = 'REQUEST_CURRENT_MEMBERSHIP_PERIOD'
export const RECEIVE_CURRENT_MEMBERSHIP_PERIOD = 'RECEIVE_CURRENT_MEMBERSHIP_PERIOD'
export const SUBMIT_MEMBERSHIP = 'SUBMIT_MEMBERSHIP'
export const SUBMIT_MEMBERSHIP_SUCCESS = 'SUBMIT_MEMBERSHIP_SUCCESS'
export const SUBMIT_MEMBERSHIP_ERROR = 'SUBMIT_MEMBERSHIP_ERROR'

const requestCurrentMembershipPeriod = () => ({
	type: REQUEST_CURRENT_MEMBERSHIP_PERIOD
})

const receiveCurrentMembershipPeriod = (json) => ({
	type: RECEIVE_CURRENT_MEMBERSHIP_PERIOD,
	currentMembershipPeriod: json
})

const fetchCurrentMembershipPeriod = () => (dispatch) => {
	dispatch(requestCurrentMembershipPeriod())
	return get('/v1/membership/currentPeriod')
		.then(data => {
    		dispatch(receiveCurrentMembershipPeriod(data))
    	});
}

export const fetchCurrentMembershipPeriodIfNeeded = () => {
  return (dispatch, getState) => {
    if (!getState().membership.currentMembershipPeriod) {
      return dispatch(fetchCurrentMembershipPeriod())
    }
  }
}

const submitMembershipAction = membership => ({
	type: SUBMIT_MEMBERSHIP,
	membership
})

const submitMembershipSuccess = membership => ({
	type: SUBMIT_MEMBERSHIP_SUCCESS,
	membership
})

const submitMembershipError = () => ({
	type: SUBMIT_MEMBERSHIP_ERROR
})

export const submitMembership = membership => dispatch => {
	dispatch(submitMembershipAction(membership))
    post('/v1/membership', membership)
    	.then((membership) => dispatch(submitMembershipSuccess(membership)))
        .catch(() => dispatch(submitMembershipError()));
}