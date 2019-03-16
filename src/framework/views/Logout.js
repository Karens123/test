'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { logout } from 'framework/action';
import * as frameworkRoute from 'framework/views/route';

class Logout extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
	};

	constructor (props, context) {
		super(props, context);
		const { actions } = props;
		actions.logout();
	}

	componentWillMount () {
		this.context.router.replace(frameworkRoute.Login);
	}

	shouldComponentUpdate () {
		return false;
	}

	render () {
		return null;
	}
}

//从而可以在组件中直接使用props: user
const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { userToken, authorizeConfig } = state.get('AuthService').toObject();
	return { userToken, authorizeConfig };
};

/*eslint-disable no-unused-labels */
const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({ logout }, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
