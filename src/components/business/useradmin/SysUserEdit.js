'use strict';

import * as Immutable from 'immutable';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Form, Icon, Input, Row, Select } from 'antd';
import * as Constant from 'utils/Constant';
import * as MsgUtil from 'utils/MsgUtil';
import * as HttpUtil from 'utils/HttpUtil';
import * as businessRoute from 'business/route';
import MySelect from 'framework/components/Select';
import {
	DEAL_SYS_USER,
	dealSysUser,
	GET_USER_ROLES_BY_USER_ID,
	getUserRolesBySysUserId,
	initASysUserForAdd,
	QRY_SYS_USER_BY_ID,
	qrySysUserById,
	qryTenantForSelect,
} from 'action';
import { QRY_SYS_ROLE, qrySysRole } from 'business/common/SysRoleService';

const Option = Select.Option;

class SysUserEdit extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		currentSysUser: PropTypes.object,
		currentUser: PropTypes.object.isRequired,
		tenantList: PropTypes.array,
		sysRoleList: PropTypes.array,
		userRoleList: PropTypes.array,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		form: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
	};
	static defaultProps = {
		currentSysUser: {},
		sysRoleList: [],
		userRoleList: [],
		tenantList: [],
	};

	constructor (props, context) {
		super(props, context);
		const { route } = props;
		if (!route) {
			this.context.router.replace(businessRoute.DiscoveryTypeAdmin);
		}
		const operType = route.path === businessRoute.SysUserEditByUserId
			? Constant.OPER_TYPE_EDIT
			: Constant.OPER_TYPE_ADD;
		this.state = { operType };
	}

	componentWillMount () {
		const { actions } = this.props;
		const { operType } = this.state;

		if (operType == Constant.OPER_TYPE_EDIT) {
			const { params } = this.props;
			const userId = params.userId;
			actions.qrySysUserById(userId);
			actions.getUserRolesBySysUserId(userId);
		} else {
			actions.initASysUserForAdd();
		}
		if (!this.props.sysRoleList || this.props.sysRoleList.length < 1) {
			actions.qrySysRole();
		}
		actions.qryTenantForSelect();
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		const { params } = this.props;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${DEAL_SYS_USER}_SUCCESS` === actionType) { //处理完成
					if (rspInfo.resultCode === Constant.REST_OK) {

						let msg = '系统用户成功';

						if (this.state.operType == Constant.OPER_TYPE_ADD) {
							msg = `新增${msg}`;
						} else if (this.state.operType == Constant.OPER_TYPE_EDIT) {
							msg = `修改${msg}`;
						} else {
							MsgUtil.showwarning('未知操作');
							return;
						}

						if (this.state.operType == Constant.OPER_TYPE_ADD) {
							this.context.router.replace(`${businessRoute.SysUserAdmin}${params.prepage?`/${params.prepage}`:''}`);
						}
						MsgUtil.showinfo(msg);


					} else {
						if (this.state.operType == Constant.OPER_TYPE_ADD) {
							MsgUtil.showerror(
								`新增系统用户错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						} else {
							MsgUtil.showerror(
								`修改系统用户错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						}
					}
				} else if (`${QRY_SYS_USER_BY_ID}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询系统用户信息失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${QRY_SYS_ROLE}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询系统角色列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${GET_USER_ROLES_BY_USER_ID}_SUCCESS` ===
					actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询系统用户角色列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				}
			}
		}
	}

	//Form reset
	handleReset = (e) => {
		e.preventDefault();
		this.props.form.resetFields();
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const { actions, currentSysUser } = this.props;
		const { operType } = this.state;

		this.props.form.validateFields((errors, editForm) => {
			const afterMergeForm = Immutable.Map(currentSysUser).
				merge(editForm).
				toObject();
			console.log('SysUserEdit commit formEdit', afterMergeForm);
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}
			actions.dealSysUser(operType, afterMergeForm);
		});
	};

	//用户名是否存在的校验
	usernameExists = (rule, username, callback) => {
		if (!username || this.state.operType === Constant.OPER_TYPE_EDIT) {
			callback();
		} else {
			const { currentUser } = this.props;
			HttpUtil.WenwenApi.post('/admin/user/qrySysUser', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					sysUser: {
						username,
						provider: currentUser.provider,
					},
				},
			}).then((ret) => {
				if (ret && ret.rspInfo.resultCode === Constant.REST_OK &&
					ret.sysUserList && ret.sysUserList.length > 0) {
					callback([new Error('抱歉，该用户名已被占用。')]);
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
		const { getFieldDecorator } = this.props.form;
		const { currentUser, currentSysUser, userRoleList,params } = this.props;
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
		};

		let str=String(currentSysUser.tenantId) && String(currentSysUser.tenantId);
		if (str=='undefined' || str==undefined) {
			str='请选择租户/商家';
		}
		const TenantIdProps = getFieldDecorator('tenantId', {
			initialValue: str && str,
			rules: [
				{
					required: true,
					message: '租户不能为空',
				},
			],
		});
		//username: 输入长度, 是否存在
		const UserNameProps = getFieldDecorator('username', {
			initialValue: currentSysUser.username,
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
				{ validator: this.usernameExists },
			],
		});

		//姓名
		const NameProps = getFieldDecorator('name', {
			initialValue: currentSysUser.name,
			rules: [
				{ required: true, message: '姓名不能为空' },
				{ max: 20, whitespace: true, message: '最多 20 个字符' },
			],
		});
		const SysRoleListNode = this.props.sysRoleList &&
			this.props.sysRoleList.map(data =>
				<Option key={String(data.roleId)} >
					{data.roleId}-{data.roleName}
				</Option>);
		//用户Id角色
		const userRoleIdList = [];
		if (userRoleList) {
			userRoleList.forEach((role) => {
				userRoleIdList.push(`${role.roleId}`);
			});
		}
		//角色列表
		const RolesProps = getFieldDecorator('userRoleIdList', {
			initialValue: userRoleIdList,
		});
		//账号提供商
		const ProviderProps = getFieldDecorator('provider', {
			initialValue: currentSysUser.provider
				? currentSysUser.provider
				: currentUser.provider,
		});
		//状态
		const StateProps = getFieldDecorator('state', {
			initialValue: currentSysUser.state,
		});

		//备注
		const RemarkProps = getFieldDecorator('remark', {
			initialValue: currentSysUser.remark,
			rules: [
				{ max: 200, whitespace: true, message: '最多 200 个字符' },
			],
		});



		const setPasswordInput = () => {
/*			console.log('currentSysUser.provider______________1:', currentSysUser.provider);
			console.log('Constant.SYS_USER_PROVIDER_ADMIN______________2:', Constant.SYS_USER_PROVIDER_ADMIN);*/

			if (currentSysUser.provider !== Constant.SYS_USER_PROVIDER_ADMIN) {
				return;
			}
			//密码
			const PasswordProps = getFieldDecorator('password', {
				initialValue: currentSysUser.password,
				rules: [
					{
						required: true,
						min: 6,
						whitespace: true,
						message: '至少 6 个字符',
					},
					{
						max: 20,
						whitespace: true,
						message: '最多 20 个字符',
					},
					{ validator: this.checkPass },
				],
			});

			//再次输入密码
			const RePasswordProps = getFieldDecorator('rePassword', {
				initialValue: currentSysUser.password,
				rules: [
					{
						required: true,
						min: 6,
						whitespace: true,
						message: '请再次输入密码',
					},
					{ validator: this.checkPass2 },
				],
			});


			return (
				<div>
					<Col span={12} >
						<Form.Item {...formItemLayout} label="密码" required >
							{PasswordProps(
								<Input type="password" placeholder="请输入密码..." />,
							)}
						</Form.Item>
					</Col>
					<Col span={12} >
						<Form.Item {...formItemLayout} label="确认密码" required >
							{RePasswordProps(
								<Input type="password" placeholder="两次输入密码保持一致" />,
							)}
						</Form.Item>
					</Col>
				</div>
			);
		};



		console.log('currentUser', currentUser);
		console.log('currentUser.tenantId________________________', currentUser.tenantId);
		console.log('currentUser.tenantId === Constant.PLATFORM_ADMIN________________________', currentUser.tenantId === Constant.PLATFORM_ADMIN);

		return (
			<Form>
				<Row>
					<Col span={24} >
						<Link to={`${businessRoute.SysUserAdmin}${params.prepage?`/${params.prepage}`:''}`} className="ant-btn" style={{ lineHeight: '25px' }} >
							<Icon type="backward" />
							<span>&nbsp;&nbsp;用户管理</span>
						</Link>
					</Col>
				</Row>
				<br /> <br /> <br />
				<Row>
					<Col span={18} offset={2} >
						{currentUser &&
						currentUser.tenantId === Constant.PLATFORM_ADMIN &&
						<Col span={12} >
							<Form.Item {...formItemLayout} label="租户" required >
								{TenantIdProps(
									<MySelect
										placeholder="请选择租户/商家"
										valueKey="tenantId"
										descKey="name"
										selectOptionDataList={this.props.tenantList}
									/>,
								)}
							</Form.Item>
						</Col>
						}
						<Col span={12} >
							<Form.Item {...formItemLayout} label="用户名" required hasFeedback >
								{UserNameProps(
									<Input placeholder="请输入用户名..." disabled={!!currentSysUser.username} />,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="姓名" required >
								{NameProps(
									<Input placeholder="请输入用户姓名..." />,
								)}
							</Form.Item>
						</Col>

						{setPasswordInput()}
						<Col span={12} >
							<Form.Item {...formItemLayout} label="状态" required >
								{StateProps(
									<Select size="large" style={{ width: 240 }} >
										<Select.Option value="U" >[U] 正常</Select.Option>
										<Select.Option value="E" >[E] 禁用</Select.Option>
									</Select>,
								)}
							</Form.Item>
						</Col>


						<Col span={12} >
							<Form.Item {...formItemLayout} label="账号提供商" required >
								{ProviderProps(
									<Input disabled="true" />,
								)}
							</Form.Item>
						</Col>

						<Col span={12} >
							<Form.Item {...formItemLayout} label="关联角色" >
								{RolesProps(
									<Select multiple style={{ width: '100%' }} placeholder="请选择角色" >
										{SysRoleListNode}
									</Select>,
								)}
							</Form.Item>
						</Col>


						<Col span={12} >
							<Form.Item {...formItemLayout} label="备注" >
								{RemarkProps(
									<Input type="textarea" rows="4" />,
								)}
							</Form.Item>
						</Col>

					</Col>
				</Row>
				<Row style={{ height: 40 }} />
				<Row>
					<Col span={18} offset={2} style={{ textAlign: 'center' }} >
						<Button type="primary" onClick={this.handleSubmit} >提交</Button>&nbsp;&nbsp;
						<Button type="primary" onClick={this.handleReset} >重置</Button>&nbsp;&nbsp;
					</Col>
				</Row>
				<br /> <br />
			</Form>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { currentUser } = state.get('AuthService').toObject();//当前登录用户
	const { userRoleList, currentSysUser, tenantList } = state.get(
		'SysUserService').
		toObject();//当前编辑系统用户
	const { sysRoleList, roleNameIsExists } = state.get('SysRoleService').
		toObject();
	return {
		rspInfo,
		currentSysUser,
		currentUser,
		actionType,
		sysRoleList,
		userRoleList,
		roleNameIsExists,
		tenantList,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qrySysRole,
			qrySysUserById,
			getUserRolesBySysUserId,
			initASysUserForAdd,
			dealSysUser,
			qryTenantForSelect,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(SysUserEdit));
