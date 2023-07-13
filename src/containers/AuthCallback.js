import React, { useEffect } from 'react';
import { Loading } from '../components/Utilities';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const AuthCallback = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { getIdTokenClaims } = useAuth0();

	useEffect(() => {
		getIdTokenClaims()
			.then((idToken) => 
				fetch(process.env.REACT_APP_API_URL + '/v1/auth0user',
				{
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ idToken: idToken.__raw })
				}))
			.then(() => navigate(searchParams.get('returnTo') || '/'));
	}, [])

	return <Loading />;
}

export default AuthCallback;