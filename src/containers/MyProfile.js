import React, { Component } from 'react';
import { connect } from 'react-redux'
import { 
	fetchProfileIfNeeded,
	submitProfile,
	editProfileField,
	deleteUser
} from '../actions/users'
import UserProfile from '../components/UserProfile'

class MyProfile extends Component
{
	componentDidMount() {
		this.props.fetchProfileIfNeeded();
	}

	render() {
		const { user, uiState, submitProfile, editProfileField, deleteUser } = this.props;
		const key = user == null ? null : user.id;
		return (<UserProfile key={key} user={user} uiState={uiState} submitProfile={submitProfile} editProfileField={editProfileField} deleteUser={deleteUser} />)
	}
}

const actionCreators = {
	submitProfile,
	editProfileField,
	fetchProfileIfNeeded,
	deleteUser
}

const mapStateToProps = state => state.profile;

export default connect(mapStateToProps, actionCreators)(MyProfile);