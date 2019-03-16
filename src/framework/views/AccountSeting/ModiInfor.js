'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	Button,
	Col,
	Form,
	Icon,
	Input,
	Modal,
	notification,
	Row,
	Select,
} from 'antd';

import * as MsgUtil from 'utils/MsgUtil';
import * as Immutable from 'immutable';
import * as HttpUtil from 'utils/HttpUtil';
import * as CookieUtil from 'utils/CookieUtil';
import * as Constant from 'utils/Constant';

import {
	dealUser,
	getUser,
	initEditAllRoles,
	initEditUser,
	initEditUserRoles,
	USER_DEAL_USER,
	userBaseInfor,
} from 'framework/action';
import './index.less';

class ModiInfor extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		form: PropTypes.object.isRequired,
		currentUser: PropTypes.object.isRequired,
		roles: PropTypes.array.isRequired,
		userroles: PropTypes.array.isRequired,
		userProfile: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actionType: PropTypes.object.isRequired,
	};

	constructor (props) {
		super(props);
		const { currentUser } = props;
		const operType = currentUser && currentUser.username
			? Constant.OPER_TYPE_EDIT
			: Constant.OPER_TYPE_ADD;
		this.state = {
			loading: false,
			visible: false,
			forceUpdata: true,
			operType,
			currentState: operType == Constant.OPER_TYPE_EDIT
				? currentUser.state
				: 'U',
		};
	}

	//只是第一次render之后被调用
	componentWillMount () {
		const { actions } = this.props;
		actions.initEditAllRoles();
		actions.initEditUserRoles(CookieUtil.getCookie('userId'));
		actions.userBaseInfor();
	}

	componentWillReceiveProps (nextProps) {
		const { actions, rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				let isRefresh = false;
				if (`${USER_DEAL_USER}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`修改用户信息失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
						return;
					}
					MsgUtil.showinfo('修改用户成功');
					isRefresh = true;
				}
				if (isRefresh) {
					const { actions, currentUser } = this.props;
					actions.getUser(currentUser.userId);
				}
			}
		}
	}

	handleSubmit = (e) => {
	};

	//Modal
	showModal = () => {
		const { currentUser, actions } = this.props;
		actions.initEditUser(currentUser);
		this.setState({ visible: true, });
	};

	handleOk = (e) => {
		e.preventDefault();

		const { actions, currentUser } = this.props;
		this.props.form.validateFields((errors, formEditPord) => {
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}

			const ModiOperType = { operType: Constant.OPER_TYPE_EDIT };
			this.setState({
				forceUpdata: true,
			});
			const afterUser = Immutable.Map(currentUser).
				merge(formEditPord).
				toObject();

			//转换roleList为对应的角色数据
			const roles = [];
			afterUser.userRoleList.forEach((item) => {
				roles.push({ roleId: item });
			});

			afterUser.userRoleList = roles;
			delete afterUser.rePassword;
			this.setState({
				ModalText: 'The modal dialog will be closed after two seconds',
				confirmLoading: true,
			});

			setTimeout(() => {
				this.setState({
					visible: false,
					confirmLoading: false,
				});
			}, 100);

			actions.dealUser(ModiOperType.operType, afterUser);
			actions.initEditAllRoles();
			actions.initEditUserRoles(CookieUtil.getCookie('userId'));
			actions.userBaseInfor();
		});
	};

	handleCancel = () => {
		this.setState({ visible: false });
	};

	render () {
		const { currentUser, roles, userroles } = this.props;
		let { userProfile } = this.props;
		if (userProfile == undefined) {
			userProfile = [];
		}

		let UsersBaseInfor = [];
		if (userProfile) {
			userProfile.forEach((item) => {
				UsersBaseInfor = item;
			});
		}

		let msgNumberData = [];
		if (UsersBaseInfor.msg == undefined) {
			msgNumberData = '';
		} else {
			msgNumberData = UsersBaseInfor.msg.number;
		}

		let CurrentState = '';
		if (currentUser.state == 'U') {
			CurrentState = '[U]正常';
		} else if (currentUser.state == 'E') {
			CurrentState = '[E]禁用';
		} else {
			CurrentState = '未知';
		}

		const openNotification = function () {
			notification.open({
				message: UsersBaseInfor.msg.msgTitle,
				description: UsersBaseInfor.msg.msgContent,
				icon: <Icon type="smile-circle" />,
			});
		};

		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 8 },
		};
		const formItemLayout_Modal = {
			labelCol: { span: 5 },
			wrapperCol: { span: 17 },
		};

		const { getFieldDecorator } = this.props.form;
		//username: 输入长度, 是否存在
		const usernameProps = getFieldDecorator('username', {
			initialValue: currentUser.username,
			rules: [
				{
					required: true,
					message: '用户名不能为空',
				},
				{
					whitespace: true,
					pattern: /^[a-zA-Z\d]\w{0,18}[a-zA-Z\d]$/,
					message: '格式不合法: 支持字母,数字,下划线, 长度(2-20)位',
				},
			],
		});

		//姓名
		const nameProps = getFieldDecorator('name', {
			initialValue: currentUser.name,
			rules: [
				{ required: true, message: '姓名不能为空' },
				{ max: 20, whitespace: true, message: '最多 20 个字符' },
			],
		});

		//状态
		const stateProps = getFieldDecorator('state', {
			initialValue: currentUser.state,
		});
		//所有角色
		const allRoles = [];
		if (roles) {
			roles.forEach((role) => {
				allRoles.push(<Select.Option
					key={role.roleId}
				>{role.roleId}-{role.roleName}</Select.Option>);
			});
		}

		//用户角色
		const userRoles = [];
		if (userroles) {
			userroles.forEach((role) => {
				userRoles.push(`${role.roleName}`);
			});
		}

		//角色列表
		const rolesProps = getFieldDecorator('userRoleList', {
			initialValue: userRoles,
		});

		//备注
		const remarkProps = getFieldDecorator('remark', {
			initialValue: currentUser.remark,
			rules: [
				{ max: 200, whitespace: true, message: '最多 200 个字符' },
			],
		});

		return (
			<Row className="ModiInfor" >


				<Row className="TopCompent" >
					<Button
						type="primary" size="large" className="editButton"
						style={{ display: 'none' }}
					>编辑图片</Button>
					<Row className="HeadInfor" >
						<div className="LeftImg" >
							<img src={UsersBaseInfor.headerIMG} />
						</div>
						<div className="RightInfor" >
							<h3><span>{currentUser.username}</span></h3>
							<p>
								上次更新时间：
								<Icon type="clock-circle-o" />
								&nbsp; {currentUser.updateTime}
							</p>
							<p>当前状态：<Icon type="heart-o" /> {CurrentState}</p>
							<p>
								当前地址：<Icon type="environment-o" />
								{UsersBaseInfor.address}
							</p>
						</div>
					</Row>

					<Row className="editinfor" >
						<Col span={24} >
							<span style={{ display: 'none' }} >
								<a href="##" ><Icon type="edit" />&nbsp;
									编辑信息</a>
							</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<span onClick={openNotification} >
								<Icon
									type="notification"
								/>&nbsp;{msgNumberData}条未读信息 </span>
						</Col>
					</Row>
				</Row>
				<Row className="infor" >
					&nbsp;
				</Row>
				<Row>
					<Col span={24} style={{ height: 50 }} >&nbsp;</Col>
				</Row>
				<Row>
					<Col
						span={23} offset={1}
						style={{ height: 50, fontSize: 20 }}
					> <Icon type="solution" /> 账号信息</Col>
				</Row>


				<div>
					<Row >
						<Col span={9} offset={4} >
							<Form.Item
								label="用户名" {...formItemLayout}
							> {currentUser.username}</Form.Item>
						</Col>
						<Col span={9} >
							<Form.Item
								label="关联角色"  {...formItemLayout}
							> {userRoles}</Form.Item>
						</Col>
						<Col span={1} >
							<Button
								type="ghost" icon="edit"
								onClick={this.showModal}
							>编辑</Button>
						</Col>
					</Row>


					<Modal
						visible={this.state.visible}
						title="编辑账号信息"
						onOk={this.handleOk}
						onCancel={this.handleCancel}
						confirmLoading={this.state.confirmLoading}
						footer={[
							<Button
								key="back" type="ghost" size="large"
								onClick={this.handleCancel}
							>取消</Button>,
							<Button
								key="submit" type="primary" size="large"
								loading={this.state.loading}
								onClick={this.handleOk}
							>
								保存
							</Button>,
						]}
					>
						<div>

							<Row>
								<Col span={24} >
									<Form horizontal >
										<Form.Item
											{...formItemLayout}
											label="用户名" required
										>
											{usernameProps(
												<Input
													placeholder="请输入用户姓名..."
													disabled
													style={{ width: 350 }}
												/>,
											)}
										</Form.Item>

										<Form.Item
											{...formItemLayout}
											label="姓名" required
										>
											{nameProps(
												<Input
													placeholder="请输入用户姓名..."
													style={{ width: 350 }}
												/>,
											)}
										</Form.Item>

										<Form.Item
											{...formItemLayout}
											label="关联角色"
										>
											{rolesProps(
												<Select
													multiple
													style={{ width: 350 }}
													disabled
													placeholder="请选择角色"
												>
													{allRoles}
												</Select>,
											)}
										</Form.Item>

										<Form.Item
											{...formItemLayout}
											label="状态"
											required
										>
											{stateProps(
												<Select
													size="large" disabled
													style={{ width: 350 }}
												>
													<Select.Option value="U" >[U]
														正常</Select.Option>
													<Select.Option value="E" >[E]
														禁用</Select.Option>
												</Select>,
											)}
										</Form.Item>

										<Form.Item
											{...formItemLayout_Modal}
											label="备注"
										>
											{remarkProps(
												<Input
													type="textarea" rows="4"
													cols="6"
												/>,
											)}
										</Form.Item>
									</Form>
								</Col>
							</Row>
						</div>
					</Modal>

					<Row>
						<Col span={9} offset={4} >
							<Form.Item
								label="姓名" {...formItemLayout}
							>{currentUser.name}</Form.Item>
						</Col>
						<Col span={9} >
							<Form.Item
								label=" 当前状态：" {...formItemLayout}
							> {CurrentState}</Form.Item>
						</Col>
						<Col span={1} />
					</Row>

					<Row>
						<Col span={9} offset={4} >
							<Form.Item
								label="创建时间" {...formItemLayout}
							>{HttpUtil.formatTime(
								currentUser.createTime)}</Form.Item>
						</Col>
						<Col span={9} >
							<Form.Item
								label="上次更新"
								{...formItemLayout}
							>{HttpUtil.formatTime(
								currentUser.updateTime)}</Form.Item>
						</Col>
						<Col span={1} />
					</Row>
					<Row >
						<Col span={9} offset={4} >
							<Form.Item label="备注:" {...formItemLayout}>
								<span>{currentUser.remark}</span></Form.Item>
						</Col>
						<Col span={9} />
						<Col span={1} />
					</Row>
				</div>

				<div className="line" />
				<Row>
					<Col
						span={23}
						offset={1}
						style={{ height: 50, fontSize: 20 }}
					> <Icon type="user" /> 基本信息
					</Col>
				</Row>
				<div>
					<br />
					<p
						style={{
							textAlign: 'center',
							fontSize: 16,
							display: 'none',
						}}
					>暂无信息</p>
					<Row >
						<Row >
							<Col span={9} offset={4} >
								<Form.Item
									label="姓名"
									{...formItemLayout}
								> {UsersBaseInfor.name}
								</Form.Item>
							</Col>
							<Col span={9} >
								<Form.Item
									label="出生日期"
									{...formItemLayout}
								> {UsersBaseInfor.birth}</Form.Item>
							</Col>
							<Col span={1} >
								<span style={{ display: 'none' }} >
									<Button
										type="ghost"
										icon="edit"
									>编辑</Button>
								</span>
							</Col>
						</Row>

						<Row>
							<Col span={9} offset={4} >
								<Form.Item
									label="性别"
									{...formItemLayout}
								>{UsersBaseInfor.sex}
								</Form.Item>
							</Col>
							<Col span={9} >
								<Form.Item
									label=" 最高学历"
									{...formItemLayout}
								>{UsersBaseInfor.college}
								</Form.Item>
							</Col>
							<Col span={1} />
						</Row>

						<Row>
							<Col span={9} offset={4} >
								<Form.Item
									label="身份"
									{...formItemLayout}
								>{UsersBaseInfor.professional}
								</Form.Item>
							</Col>
							<Col span={9} >
								<Form.Item
									label=" 微信账号"
									{...formItemLayout}
								>{UsersBaseInfor.wechat}
								</Form.Item>
							</Col>
							<Col span={1} />
						</Row>

						<Row>
							<Col span={9} offset={4} >
								<Form.Item
									label="婚否"
									{...formItemLayout}
								>{UsersBaseInfor.marriage}
								</Form.Item>
							</Col>
							<Col span={9} >
								<Form.Item
									label=" 联系方式"
									{...formItemLayout}
								>{UsersBaseInfor.tel}
								</Form.Item>
							</Col>
							<Col span={1} />
						</Row>
						<Row>
							<Col span={9} offset={4} >
								<Form.Item
									label="地址"
									{...formItemLayout}
								>{UsersBaseInfor.address}
								</Form.Item>
							</Col>
							<Col span={9} >
								<Form.Item
									label="QQ号"
									{...formItemLayout}
								>
									{UsersBaseInfor.qq}
								</Form.Item>
							</Col>
							<Col span={1} />
						</Row>

						<Row >
							<Col span={9} offset={4} >
								<Form.Item label="备注:" {...formItemLayout}>
									<span>{UsersBaseInfor.remark}</span></Form.Item>
							</Col>
							<Col span={9} />
							<Col span={1} />
						</Row>
					</Row>
				</div>

			</Row>
		);
	}
}

const mapStateToProps = (state) => {
	const { currentUser } = state.get('AuthService').toObject();
	const { rspInfo, roles, userroles, userProfile } = state.get(
		'SettingService').toObject();
	return {
		currentUser,
		rspInfo,
		roles,
		userroles,
		userProfile,
	};
};

/*eslint-disable no-unused-labels */
const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			initEditAllRoles,
			initEditUserRoles,
			initEditUser,
			dealUser,
			userBaseInfor,
			getUser,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ModiInfor));
