import React, { Component } from 'react';
import { connect } from 'react-redux'
import { 
	fetchPermissions
} from '../actions/users'

const actionCreators = {
	fetchPermissions
}

const mapStateToProps = state => ({ permissions: state.permissions || {} });

export function withPermissions(WrappedComponent) {
	return connect(mapStateToProps, actionCreators)(class extends React.Component {
		componentDidMount() {
			this.props.fetchPermissions();
		}

		render() {
			return (<WrappedComponent {...this.props} />)
		}
	})
}