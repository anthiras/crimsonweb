import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from "react-router";
import { 
	fetchPermissions
} from '../actions/users'

const actionCreators = {
	fetchPermissions
}

const mapStateToProps = (state, ownProps) => ({ permissions: state.permissions.items || {}, ...ownProps });

export function withPermissions(WrappedComponent) {
	return withRouter(connect(mapStateToProps, actionCreators)(class extends React.Component {
		componentDidMount() {
			this.props.fetchPermissions();
		}

		render() {
			return (<WrappedComponent {...this.props} />)
		}
	}))
}