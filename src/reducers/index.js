import { combineReducers } from 'redux'
import { courses } from './courses'
import { profile, users, roles } from './users'
import { membership } from './membership'

const rootReducer = combineReducers({
    courses,
    profile,
    membership,
    users,
    roles
})

export default rootReducer