import React, { useEffect } from 'react';
import { useSelector } from 'react-redux'
import useMembershipActions from '../actions/membership'
import Membership from '../components/Membership'
import useUserActions from '../actions/users';

const MembershipForm = () => {
	const { fetchCurrentMembershipPeriodIfNeeded } = useMembershipActions();
	const { fetchProfileIfNeeded } = useUserActions();

	const profile = useSelector((state) => state.profile);
	const currentMembershipPeriod = useSelector((state) => state.membership.currentMembershipPeriod);

	useEffect(() => {
		fetchCurrentMembershipPeriodIfNeeded();
		fetchProfileIfNeeded();
	}, []);
	
	return <Membership profile={profile} currentMembershipPeriod={currentMembershipPeriod} />;
}

export default MembershipForm;
