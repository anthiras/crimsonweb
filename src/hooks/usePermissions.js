import { useEffect } from 'react';
import { useSelector } from 'react-redux'
import useUserActions from '../actions/users'
import { useAuth0 } from '@auth0/auth0-react';

const usePermissions = () => {
    const { fetchPermissions}  = useUserActions();
	const { user } = useAuth0();

    useEffect(() => {
        fetchPermissions();
    }, [user])
	
    const permissions = useSelector((state) => state.permissions.items || {})

    return permissions;
}

export default usePermissions;
