'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Card, Col, Form, Icon, Input, Row } from 'antd';
import * as Immutable from 'immutable';
import * as Constant from 'utils/Constant';
import * as HttpUtil from 'utils/HttpUtil';
import * as MsgUtil from 'utils/MsgUtil';
import * as frameworkRoute from 'framework/views/route';

import './index.less';
import { dealUser, getAllNewsList, logout, USER_DEAL_USER } from '../../action';

class InforSeting extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		form: PropTypes.object.isRequired,
		newlist: PropTypes.array.isRequired,
		currentUser: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actionType: PropTypes.object.isRequired,
	};

	constructor (props, context) {
		super(props, context);
		this.state = {
			current: '1',
			openKeys: [],
			operType: Constant.OPER_TYPE_EDIT,
		};
	}

	componentWillMount () {
		const { actions } = this.props;
		actions.getAllNewsList();
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${USER_DEAL_USER}_SUCCESS` === actionType) { // 处理完成
					if (rspInfo.resultCode === Constant.REST_OK) {
						const msg = '密码修改成功';
						MsgUtil.showinfo(msg);
						this.context.router.replace(frameworkRoute.Logout);
					} else {
						MsgUtil.showerror(
							`密码修改错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
					}
				}
			}
		}
	}

	handleClick = (e) => {
		const { newlist } = this.props;
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const { actions, currentUser } = this.props;
		const { operType } = this.state;

		this.props.form.validateFields((errors, editForm) => {
			console.log('Setting commit formEdit', editForm);
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}
			const afterMergeForm = Immutable.Map(currentUser).
				merge(editForm).
				toObject();
			actions.dealUser(operType, afterMergeForm);
		});
	};

	//密码校验
	checkOldPass = (rule, value, callback) => {
		if (!value) {
			callback();
		} else {
			const { currentUser } = this.props;
			HttpUtil.WenwenApi.post('/admin/user/checkOldPassword', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					userId: currentUser.userId,
					oldPassword: value,
				},
			}).then((ret) => {
				if (ret && ret.rspInfo.resultCode !== Constant.REST_OK) {
					callback('抱歉，密码错误。');
				} else {
					callback();
				}
			});
		}
	};

	//密码校验
	checkPass = (rule, value, callback) => {
		const { validateFields } = this.props.form;
		if (value) {
			validateFields(['rePassword'], { force: true });
		}
		callback();
	};

	//两次密码校验
	checkPass2 = (rule, value, callback) => {
		const { getFieldValue } = this.props.form;

		if (value && value !== getFieldValue('password')) {
			callback('两次输入密码不一致！');
		} else {
			callback();
		}
	};

	render () {
		const { newlist } = this.props;
		const { getFieldProps } = this.props.form;
		const { operType } = this.state;

		//旧密码
		const oldPassWord = getFieldProps('oldPassWord', {
			rules: [
				{ required: true, validator: this.checkOldPass },
			],
		});

		//新密码
		const passwordProps = getFieldProps('password', {
			rules: [
				{
					required: true,
					min: 6,
					whitespace: true,
					message: '至少 6 个字符',
				},
				{
					required: true,
					max: 20,
					whitespace: true,
					message: '最多 20 个字符',
				},
				{
					required: true,
					validator: this.checkPass,
				},
			],
		});

		//确认新密码
		const rePasswordProps = getFieldProps('rePassword', {
			rules: [
				{
					required: true,
					min: 6,
					whitespace: true,
					message: '至少 6 个字符',
				},
				{
					required: true,
					max: 20,
					whitespace: true,
					message: '最多 20 个字符',
				},// {validator: this.usernameExists},
				{
					required: true,
					validator: this.checkPass2,
				},
			],
		});

		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 8 },
		};

		const renderCardTitle = () =>
			<span>
				<Icon type="unlock" size="large" />&nbsp;&nbsp;
				<span>账号密码    &nbsp; &nbsp;
					<span
						style={{
							fontSize: 13,
							fontWeight: 'normal',
							color: '#999',
						}}
					>(用户保护账号信息和登录安全)</span>
				</span>
			</span>;

		return (
			<div>
				<Card
					title={renderCardTitle()} bordered={false}
					style={{ width: '100%' }}
				>
					<div className="setBroad" >
						<Row>
							<Col >
								<Form horizontal >
									<Form.Item
										label="旧密码：" required
										hasFeedback  {...formItemLayout}
									>
										<Input
											style={{ width: 270 }}  {...oldPassWord}
											type="password"
											placeholder="输入6到8位的旧密码"
										/>
									</Form.Item>
									<Form.Item
										label="新密码：" required
										hasFeedback  {...formItemLayout}
									>
										<Input
											style={{ width: 270 }}  {...passwordProps}
											type="password"
											placeholder="输入6到8位的新密码"
										/>
									</Form.Item>
									<Form.Item
										label="确认密码：" required
										hasFeedback  {...formItemLayout}
									>
										<Input
											style={{ width: 270 }}  {...rePasswordProps}
											type="password"
											placeholder="输入6到8位的确认密码"
										/>
									</Form.Item>
									<br />
									<Form.Item
										wrapperCol={{ span: 7, offset: 6 }}
									>
										<Button
											type="primary"
											onClick={this.handleSubmit}
										>提交</Button>&nbsp;&nbsp;
										<Button
											type="primary"
											onClick={this.handleReset}
										>重置</Button>&nbsp;&nbsp;
									</Form.Item>
								</Form>
							</Col>
						</Row>
					</div>
				</Card>
			</div>
		);
	}
}

//从而可以在组件中直接使用props: user
const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { newlist } = state.get('HelpService').toObject();
	const { currentUser } = state.get('AuthService').toObject();
	return {
		newlist,
		currentUser,
		rspInfo,
		actionType,
	};
};

/*eslint-disable no-unused-labels */
const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({ getAllNewsList, dealUser, logout },
			dispatch),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(InforSeting));
