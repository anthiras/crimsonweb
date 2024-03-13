import { useSelector, useDispatch } from 'react-redux'
import useApi from '../shared/Api'
import { useCallback } from 'react'

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

const useMembershipActions = () => {
	const { get, post } = useApi();
	const dispatch = useDispatch();
	const currentMembershipPeriod = useSelector((state) => state.membership.currentMembershipPeriod);

	return {
		fetchCurrentMembershipPeriodIfNeeded: () => {
			if (!currentMembershipPeriod) {
				dispatch(requestCurrentMembershipPeriod())
				return get('/v1/membership/currentPeriod')
					.then(data => {
						dispatch(receiveCurrentMembershipPeriod(data))
					});
			}
		},
  
		submitMembership: (membership) => {
			dispatch(submitMembershipAction(membership))
			post('/v1/membership', membership)
				.then((membership) => dispatch(submitMembershipSuccess(membership)))
				.catch(() => dispatch(submitMembershipError()));
		},
	}
}

export default useMembershipActions;
