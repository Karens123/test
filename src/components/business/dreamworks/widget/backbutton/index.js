'use strict';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Icon } from 'antd';

export default class BackButton extends React.Component{
	static propTypes = {
		to: PropTypes.string.isRequired,
		text: PropTypes.string.isRequired,
	};
	render(){
		const { to,text } = this.props;
		return (
			<Link
				to={to}
				className="ant-btn"
				style={{ lineHeight: '28px' }}
			>
				<Icon type="backward" />
				<span>&nbsp;&nbsp;{text}</span>
			</Link>
		);
	}
}
