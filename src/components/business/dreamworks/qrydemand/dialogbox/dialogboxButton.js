'use strict';

import React, { PropTypes } from 'react';
import { Button } from 'antd';

export default class DialogboxButton extends React.Component{
	static propTypes = {
		remindConfirm: PropTypes.func.isRequired,
		confirmHandler: PropTypes.func.isRequired,
	};
	static defaultProps = {
		text: '聊天'
	};
	render(){
		const { remindConfirm,confirmHandler } = this.props;
		return (
			<div className="dialogbox-btn-group">
				<Button type="danger" size={'large'} onClick={remindConfirm} >提醒商家确认</Button>
				<span style={{ display: 'inline-block',width: '30px' }} />
				<Button type="primary" size={'large'} onClick={confirmHandler} >确认完成</Button>
			</div>
		);
	}
}
