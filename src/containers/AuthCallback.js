import React from 'react';
import { Loading } from '../components/Utilities';
import Auth from '../shared/Auth'

const AuthCallback = (nextState) => {
	const auth = new Auth();
	auth.handleAuthentication(nextState);
	return <Loading />;
}

export default AuthCallback;