import React, { Component } from 'react';
import { connect } from 'react-redux'
import { fetchCurrentMembershipPeriodIfNeeded, submitMembership } from '../actions/membership'
import { fetchProfileIfNeeded, submitProfile, editProfileField } from '../actions/users'
import Membership from '../components/Membership'

class MembershipForm extends Component
{
	componentDidMount() {
		this.props.fetchCurrentMembershipPeriodIfNeeded();
		this.props.fetchProfileIfNeeded();
	}

	render() {
		const { profile, currentMembershipPeriod, submitMembership, submitProfile, editProfileField } = this.props;
		return (
			<Membership 
				profile={profile} 
				currentMembershipPeriod={currentMembershipPeriod} 
				submitMembership={submitMembership}
				submitProfile={submitProfile}
				editProfileField={editProfileField} />)
	}
}

const actionCreators = {
	fetchCurrentMembershipPeriodIfNeeded,
	fetchProfileIfNeeded,
	submitMembership,
	submitProfile,
	editProfileField
}

const mapStateToProps = state => ({
	profile: state.profile,
	currentMembershipPeriod: state.membership.currentMembershipPeriod
});

export default connect(mapStateToProps, actionCreators)(MembershipForm);