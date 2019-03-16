'use strict';

import React, { PropTypes } from 'react';
import { Form, Input, Modal, Radio, Select } from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;

const pushBigType = [// 1-系统 2-活动/推荐 3-吻吻服务 4-资讯
	{ key: '1', value: '系统' },
	{ key: '2', value: '活动/推荐' },
	{ key: '3', value: '吻吻服务' },
	{ key: '4', value: '资讯' },
];

const pushType = {
	// 大类1-系统：1-系统信息，1001-强制退出消息，后续从1002开始定义；
	// 大类2-活动/推荐：2-活动信息，后续从2001开始定义；
	// 大类3-吻吻服务：3-发起绑定 4-绑定回应 6-吻吻蜜语
	// 8-情侣等级提升 9-背景图片更新，后续从3001开始定义；
	// 大类4-资讯：4001-普通资讯
	1: [{ key: '1001', value: '强制退出' }],
	2: [{ key: '2', value: '活动信息' }],
	3: [
		{ key: '3', value: '发起绑定' },
		{ key: '4', value: '绑定回应' },
		{ key: '6', value: '吻吻蜜语' },
		{ key: '8', value: '情侣等级提升' },
		{ key: '9', value: '背景图片更新' },
	],
	4: [{ key: '4001', value: '普通资讯' }],
};

class RePushModal extends React.Component {
	static propTypes = {
		form: PropTypes.object.isRequired,
		handleSubmit: PropTypes.func.isRequired,
		handleCancel: PropTypes.func.isRequired,
		currentPushInfo: PropTypes.func.isRequired,
		visible: PropTypes.bool.isRequired,
		rePushType: PropTypes.number.isRequired,
	};
	handleSubmit = () => {
		this.props.form.validateFields((errors, editForm) => {
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}
			if (editForm.target == 'all') {
				editForm.targetValue = 'all';
			}
			this.props.handleSubmit(editForm);
		});
	};

	handleCancel = () => {
		this.props.handleCancel();
	};

	render () {
		let { currentPushInfo } = this.props;
		if (!currentPushInfo) {
			currentPushInfo = {};
		}

		const { getFieldDecorator, getFieldValue } = this.props.form;

		const pushBigTypeOptions = pushBigType.map(
			bigType =>
				<Option key={bigType.key} >{bigType.key}-{bigType.value}</Option>);

		//通知大类
		const PushBigTypeProp = getFieldDecorator('pushBigType', {
			initialValue: currentPushInfo.pushBigType,
		});

		//通知小类
		const PushTypeProp = getFieldDecorator('pushType', {
			initialValue: currentPushInfo.pushType,
		});

		const pushTypeOptions = () => {
			if (currentPushInfo.pushBigType) {
				return pushType[currentPushInfo.pushBigType].map(
					pushType =>
						<Option key={pushType.key} >{pushType.key}-{pushType.value}</Option>);
			}
		};
		const TitleProp = getFieldDecorator('title', {
			initialValue: currentPushInfo.title,
		});

		const BodyProp = getFieldDecorator('body', {
			initialValue: currentPushInfo.body,
		});
		//推送目标
		const TargetProp = getFieldDecorator('target', {
			initialValue: currentPushInfo.target,
		});

		const TargetValueProp = getFieldDecorator('targetValue', {
			initialValue: currentPushInfo.targetValue,
		});

		const targetValueNode = () => {
			switch (getFieldValue('target')) {
				case 'all':
					return undefined;
				case 'device':
					return (
						<FormItem {...formItemLayout} colon={false} label="&nbsp;&nbsp;" >
							{TargetValueProp(
								<Input placeholder="请输入deviceId,多个终端用逗号分隔" />,
							)}
						</FormItem>
					);
				case 'account':
					return (

						<FormItem {...formItemLayout} colon={false} label="&nbsp;&nbsp;" >
							{TargetValueProp(
								<Input placeholder="请输入wenwenId,多个wenwenId用逗号分隔" />,
							)}
						</FormItem>
					);
			}
		};

		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};

		const modalTitle = `重发${this.props.rePushType === 0
			? '消息'
			: '通知'}${currentPushInfo.title}`;
		return (
			<Modal title={modalTitle} visible={this.props.visible} onOk={this.handleSubmit} onCancel={this.handleCancel} >
				<Form >
					<FormItem {...formItemLayout} label="推送大类" >
						{PushBigTypeProp(
							<Select disabled >
								{pushBigTypeOptions}
							</Select>,
						)}
					</FormItem>
					<FormItem {...formItemLayout} label="推送小类" >
						{PushTypeProp(
							<Select disabled >
								{pushTypeOptions()}
							</Select>,
						)}
					</FormItem>
					<FormItem {...formItemLayout} label="标题" >
						{TitleProp(
							<Input disabled />,
						)}
					</FormItem>
					<FormItem {...formItemLayout} label="内容" >
						{BodyProp(
							<Input type="textarea" disabled />,
						)}
					</FormItem>
					<FormItem {...formItemLayout} label="发送对象" >
						{TargetProp(
							<RadioGroup  >
								<Radio value="all" >所有</Radio>
								<Radio value="device" >指定终端</Radio>
								<Radio value="account" >指定wenwenId</Radio>
							</RadioGroup>,
						)}
					</FormItem>
					{targetValueNode()}
				</Form>
			</Modal>
		);
	}
}

export default Form.create()(RePushModal);
