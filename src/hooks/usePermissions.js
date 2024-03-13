import { useEffect } from 'react';
import { useSelector } from 'react-redux'
import useUserActions from '../actions/users'
import { createSelector } from '@reduxjs/toolkit';

const selectPermissionItems = (state) => state.permissions.items;
const selectPermissions = createSelector([selectPermissionItems], (items) => items || {});

const usePermissions = () => {
    const { fetchPermissions}  = useUserActions();
	// const { user } = useAuth0();

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);
	
    const permissions = useSelector(selectPermissions);

    return permissions;
}

export default usePermissions;
