import { combineReducers } from 'redux'
import { courses } from './courses'
import { profile, users, roles, permissions } from './users'
import { membership } from './membership'

const rootReducer = combineReducers({
    courses,
    profile,
    membership,
    users,
    roles,
    permissions
})

export default rootReducer