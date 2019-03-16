'use strict';

import React from 'react';
import { Link } from 'react-router';
import { Alert } from 'antd';
import 'antd/dist/antd.less';

const onClose = function (e) {
	console.log(e, 'I was closed.');
};

export default class MyAlert extends React.Component {
	static propTypes = {};

	render () {
		return (
			<div>
				<h1><Link to="/admin/example" ><span>例子目录</span></Link></h1>
				<Alert message="Success Text" type="success" />
				<Alert
					message="Warning Text"
					type="warning"
					closable
					onClose={onClose}
				/>
				<Alert
					message="Error Text"
					description="Error Description Error Description Error Description Error Description Error Description Error Description"
					type="error"
					closable
					onClose={onClose}
				/>
				<Alert message="Info Text" type="info" closeText="Close Now" />
				<Alert
					message="Success Text"
					description="Success Description Success Description Success Description"
					type="success"
				/>
				<Alert
					message="Info Text"
					description="Info Description Info Description Info Description Info Description"
					type="info"
				/>
				<Alert
					message="Warning Text"
					description="Warning Description Warning Description Warning Description Warning Description"
					type="warning"
				/>
				<Alert
					message="Error Text"
					description="Error Description Error Description Error Description Error Description"
					type="error"
				/>
				<Alert message="成功提示的文案" type="success" showIcon />
				<Alert message="消息提示的文案" type="info" showIcon />
				<Alert message="警告提示的文案" type="warning" showIcon />
				<Alert message="错误提示的文案" type="error" showIcon />
				<Alert
					message="成功提示的文案"
					description="成功提示的辅助性文字介绍成功提示的辅助性文字介绍成功提示的辅助性文字介绍成功提示的辅助性文字介绍"
					type="success"
					showIcon
				/>
				<Alert
					message="消息提示的文案"
					description="消息提示的辅助性文字介绍消息提示的辅助性文字介绍消息提示的辅助性文字介绍"
					type="info"
					showIcon
				/>
				<Alert
					message="警告提示的文案"
					description="警告提示的辅助性文字介绍警告提示的辅助性文字介绍"
					type="warning"
					showIcon
				/>
				<Alert
					message="错误提示的文案"
					description="错误提示的辅助性文字介绍错误提示的辅助性文字介绍错误提示的辅助性文字介绍错误提示的辅助性文字介绍错误提示的辅助性文字介绍错误提示的辅助性文字介绍"
					type="error"
					showIcon
				/>
				<Alert message="Success Text" type="success" />
				<Alert message="Info Text" type="info" />
				<Alert message="Warning Text" type="warning" />
				<Alert message="Error Text" type="error" />
			</div>
		);
	}
}