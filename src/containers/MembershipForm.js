import React, { useEffect } from 'react';
import { useSelector } from 'react-redux'
import useMembershipActions from '../actions/membership'
import Membership from '../components/Membership'
import useUserActions from '../actions/users';

const MembershipForm = () => {
	const { fetchCurrentMembershipPeriodIfNeeded } = useMembershipActions();
	const { fetchProfileIfNeeded } = useUserActions();

	const { profile, currentMembershipPeriod } = useSelector((state) => ({
		profile: state.profile,
		currentMembershipPeriod: state.membership.currentMembershipPeriod
	}))

	useEffect(() => {
		fetchCurrentMembershipPeriodIfNeeded();
		fetchProfileIfNeeded();
	}, []);
	
	return <Membership profile={profile} currentMembershipPeriod={currentMembershipPeriod} />;
}

export default MembershipForm;
