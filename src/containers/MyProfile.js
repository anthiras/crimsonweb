import React, { useEffect } from 'react';
import { useSelector } from 'react-redux'
import UserProfile from '../components/UserProfile'
import useUserActions from '../actions/users';

const MyProfile = () => {
	const { fetchProfileIfNeeded } = useUserActions();

	useEffect(() => {
		fetchProfileIfNeeded();
	}, []);

	const { uiState, user } = useSelector((state) => state.profile);

	return <UserProfile 
		key={user?.id}
		user={user}
		uiState={uiState}
		allowDelete={true} />
}

export default MyProfile;