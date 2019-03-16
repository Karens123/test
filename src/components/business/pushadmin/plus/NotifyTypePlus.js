'use strict';

import React, { PropTypes } from 'react';
import { Card, Checkbox, Radio, Row } from 'antd';

const RadioGroup = Radio.Group;
/**
 调用方式
 <NotifyTypePlus
 type={this.props.type}
 deviceType={this.props.deviceType}
 NotifyTypeProp={NotifyTypeProp}
 RemindProp={RemindProp}
 />
 **/
const iosRemindNode = (type, deviceType, RemindProp) => {
	if (type === '1' || deviceType === '1') { //通知或者android设备都不显示ios提醒方式选项
		return undefined;
	}
	return (
		<Row>{deviceType === '3' ? 'IOS' : ''}提醒方式：&nbsp;&nbsp;
			{RemindProp(
				<Checkbox >离线消息转通知</Checkbox>,
			)}
		</Row>
	);
};
const androidNotifyTypeNode = (deviceType, NotifyTypeProp) => {
	if (deviceType === '0') { //ios设备不显示android的提醒设置选项
		return undefined;
	}
	return (
		<Row >{deviceType === '3' ? 'Android' : ''}提醒方式：&nbsp;&nbsp;
			{NotifyTypeProp(
				<RadioGroup >
					<Radio value="0" >静音</Radio>
					<Radio value="1" >振动</Radio>
					<Radio value="2" >声音</Radio>
					<Radio value="3" >声音和振动</Radio>
				</RadioGroup>,
			)}
		</Row>
	);
};

class NotifyTypePlus extends React.Component {
	static propTypes = {
		deviceType: PropTypes.number.isRequired,
		type: PropTypes.number.isRequired,
		RemindProp: PropTypes.object.isRequired,
		NotifyTypeProp: PropTypes.object.isRequired,
	};

	render () {
		const { type, deviceType, RemindProp, NotifyTypeProp } = this.props;
		return (
			<Card title="通知提醒方式:" bordered={false} style={{ marginTop: '5px' }} >
				{iosRemindNode(type, deviceType, RemindProp)}
				{androidNotifyTypeNode(deviceType, NotifyTypeProp)}
			</Card>
		);
	}
}

export default NotifyTypePlus;
