'use strict';

import React, { PropTypes } from 'react';
import { Button } from 'antd';

export default class DialogboxButton extends React.Component{
	static contextTypes = {
		router: PropTypes.object.isRequired,
		store: PropTypes.object.isRequired,
		deviceType: PropTypes.number.isRequired,
	};

	static propTypes = {
		remindConfirm: PropTypes.func.isRequired,
		confirmHandler: PropTypes.func.isRequired,
		deviceType: PropTypes.number,
	};
	static defaultProps = {
		text: '聊天',
		deviceType: ''
	};
	render(){
		const { remindConfirm,confirmHandler,deviceType } = this.props;
		if ( deviceType&& deviceType==4 ) {
			return (
				<div className="dialogbox-btn-group">
					<span>己提醒商家</span>
					<span style={{ display: 'inline-block',width: '30px' }} />
					<span>己完成</span>
				</div>
			);
		} else {
			return (
				<div className="dialogbox-btn-group">
					<Button type="danger" size={'large'} onClick={remindConfirm} >提醒商家确认</Button>
					<span style={{ display: 'inline-block',width: '30px' }} />
					<Button type="primary" size={'large'} onClick={confirmHandler} >确认完成</Button>
				</div>
			);
		}
	};



}
