'use strict';

import * as Immutable from 'immutable';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	Button,
	Card,
	Col,
	Form,
	Icon,
	Input,
	Row,
	Select,
	Transfer
} from 'antd';
import * as actions from 'action';
import * as businessRoute from 'business/route';
import * as MsgUtil from 'utils/MsgUtil';
import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

class RoleEdit extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		currentRole: PropTypes.object,
		entities: PropTypes.array,
		roleentities: PropTypes.array,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		form: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
		params: PropTypes.string.isRequired,
		location: PropTypes.object.isRequired,
	};
	static defaultProps = {
		currentRole: {},
		entities: [],
		roleentities: [],
	};

	constructor (props) {
		super(props);
		const { currentRole,params } = this.props;
		const { path } = this.props.route;
		const currentRoleId =this.props.params.role;
		const operType = path && /add/.test(this.props.location.pathname)
			? Constant.OPER_TYPE_ADD
			: Constant.OPER_TYPE_EDIT;
		this.state = {
			// currentRole: params.role?currentRole:{},
			currentRoleId,
			operType,
			currentState: operType == Constant.OPER_TYPE_EDIT
				? currentRole.state
				: 'U',
			//Transfer
			entType: Constant.ENT_TYPE_BUTTON,
			dataSource: [],
			selectedKeys: [],
			refreshed: false,   //避免再次刷新
		};

	}

	componentWillMount () {
		const { currentRoleId,operType } = this.state;
		const { actions,params } = this.props;
		actions.initEditAllEntities(this.state.entType);
		actions.initEditRoleEntities(params.role);
		if (params.role){
			const sysRole={ roleId: currentRoleId };
			actions.getAllRole(sysRole);

		}
	}

	//在这里触发setState()不会重复触发render
	componentWillReceiveProps (nextProps) {
		const { operType } = this.state;
		const { params } = this.props;
		if (operType == Constant.OPER_TYPE_ADD) {
			const { entities } = nextProps;
			if (entities) {
				const dataSource = [];      //所有可用的
				for (const i in entities) {
					const entity = entities[i];
					const data = {
						key: entity.entId,
						title: `${entity.entId}-${entity.entName}`,
					};

					dataSource.push(data);
				}

				this.state.dataSource = dataSource;
			}
		} else if (operType == Constant.OPER_TYPE_EDIT) {
			const { entities, roleentities } = nextProps;

			if (entities && roleentities) {
				const dataSource = [];      //所有可用的
				for (const i in entities) {
					const entity = entities[i];
					const data = {
						key: entity.entId,
						title: `${entity.entId}-${entity.entName}`,
					};

					dataSource.push(data);
				}
				this.state.dataSource = dataSource;

				const selectedKeys = [];
				if (roleentities) {
					for (const i in roleentities) {
						const roleentity = roleentities[i];
						selectedKeys.push(roleentity.entId);
					}
					this.state.selectedKeys = selectedKeys;
				}
			}
		} else {
			console.log('Should not happend', operType);
		}

		const { rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${actions.ROLE_DEAL_ROLE}_SUCCESS` === actionType) { //处理完成
					if (rspInfo.resultCode === Constant.REST_OK) {
						let msg = '成功';
						if (this.state.operType == Constant.OPER_TYPE_ADD) {
							msg = `新增${msg}`;
						} else if (this.state.operType ==
							Constant.OPER_TYPE_EDIT) {
							msg = `修改${msg}`;
						} else {
							MsgUtil.showwarning('未知操作');
							return;
						}
						MsgUtil.showinfo(msg);
						this.context.router.replace(`${businessRoute.RoleAdmin}${params.prepage?`/${params.prepage}`:''}`);
					} else {
						if (this.state.operType == Constant.OPER_TYPE_ADD) {
							MsgUtil.showerror(
								`新增角色信息.错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						} else {
							MsgUtil.showerror(
								`修改角色信息.错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						}
					}
				}

			}
		}
	}

	//授权类型选择
	entTypeChange (e) {
		this.state.entType = e.target.value;
	}

	//State变化时触发
	stateChange = (value) => {
		this.state.currentState = value;
	};

	//Form reset
	handleReset = (e) => {
		e.preventDefault();
		this.props.form.resetFields();
	};

	//Form submit
	handleSubmit = (e) => {
		e.preventDefault();
		const { currentRole, actions } = this.props;
		const { selectedKeys, currentState } = this.state;
		const formEditRole = this.props.form.getFieldsValue();

		const afterRole = Immutable.Map(currentRole).
		merge(formEditRole).
		toObject();

		//转换entList为对应的角色数据
		const entities = [];
		selectedKeys.forEach((item) => {
			entities.push({ entId: item });
		});
		afterRole.roleEntList = entities;
		afterRole.state = currentState;
		this.props.form.validateFields((errors) => {
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}

			actions.dealRole(this.state.operType, afterRole);
		});
	};

	//角色名是否存在的校验
	roleNameExists = (rule, roleName, callback) => {
		if (!roleName || this.state.operType === Constant.OPER_TYPE_EDIT) {
			callback();
		} else {
			HttpUtil.WenwenApi.post('/admin/user/qrySysRole', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					sysRole: { roleName },
				},
			}).then((ret) => {
				if (ret && ret.rspInfo.resultCode === Constant.REST_OK &&
					ret.sysRoleList && ret.sysRoleList.length > 0) {
					callback([new Error('抱歉，该角色名已被占用。')]);
				} else {
					callback();
				}
			});
		}
	};

	//Transfer的改变事件
	handleTransferChange = (selectedKeys, direction, moveKeys) => {
		this.setState({ selectedKeys });
	};
	render () {
		const { getFieldDecorator } = this.props.form;
		const { params } = this.props;
		let { currentRole } = this.props;
		if (!params.role){
			currentRole = {};
		}
		//roleName: 输入长度, 是否存在
		const roleNameProps = getFieldDecorator('roleName', {
			initialValue: currentRole.roleName,
			rules: [
				{ required: true, message: '角色名不能为空' },
				{ max: 20, message: '最多20个字符' },
				{ validator: this.roleNameExists },
			],
		});

		//备注
		const remarkProps = getFieldDecorator('remark', {
			initialValue: currentRole.remark,
			rules: [
				{ max: 200, whitespace: true, message: '最多 200 个字符' },
			],
		});


		const stateProps = getFieldDecorator('state', {
			initialValue: params.role?currentRole.state: null,
		});


		const formItemLayout = {
			labelCol: { span: 7 },
			wrapperCol: { span: 16 },
		};

		return (
			<div>
				<Row>
					<Col span={16} >
						<Link to={`${businessRoute.RoleAdmin}${params.prepage?`/${params.prepage}`:''}`}  className="ant-btn" style={{ lineHeight: '25px' }} >
							<Icon type="backward" />
							<span>&nbsp;&nbsp;角色管理</span>
						</Link>
					</Col>
				</Row>
				<Row>
					<Col span="824" >&nbsp;</Col>
				</Row>
				<Row>
					<Col span="9" >
						<Card title="角色信息" bordered={false} >
							<Form layout="horizontal" >
								<Form.Item {...formItemLayout} label="角色名称" required >
									{roleNameProps(
										<Input placeholder="请输入角色名称..." disabled={!!currentRole.roleName} />,
									)}
								</Form.Item>

								<Form.Item {...formItemLayout} label="角色状态" required >
									{stateProps(
										<Select
											id="state"
											size="large"
											onChange={this.stateChange}
										>
											<Select.Option value="U" >[U] 正常</Select.Option>
											<Select.Option value="E" >[E] 禁用</Select.Option>
										</Select>
									)}
								</Form.Item>

								<Form.Item {...formItemLayout} label="备注" >
									{remarkProps(
										<Input type="textarea" rows="8" />)}
								</Form.Item>

								<Form.Item
									wrapperCol={{
										span: 12,
										offset: 8,
									}}
								>
									<Button type="primary" onClick={this.handleSubmit} >提交</Button> &nbsp;&nbsp;
									<Button type="primary" onClick={this.handleReset} >重置</Button> &nbsp;&nbsp;
								</Form.Item>
							</Form>
						</Card>
					</Col>
					<Col span="1" />
					<Col span="14" >
						<Card title="角色授权" bordered >
							<Transfer
								titles={['未授权实体', '已授权实体']}
								dataSource={this.state.dataSource}
								listStyle={{ width: 250, height: 350 }}
								notFoundContent="数据为空"
								targetKeys={this.state.selectedKeys}
								onChange={this.handleTransferChange}
								render={item => item.title}
							/>
						</Card>
						<br /> <br /> <br />
					</Col>
				</Row>
			</div>

		);

	}
}
const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { currentRole, refreshData, entities, roleentities } = state.get(
		'roleadmin').toObject();
	return {
		currentRole: currentRole ? currentRole : {},
		rspInfo,
		refreshData,
		entities,
		roleentities,
		actionType,
	};
};

const mapDispatchToProps = (dispatch) => {
	const { dealRole, initEditAllEntities, initEditRoleEntities,getAllRole } = actions;
	return {
		actions: bindActionCreators(
			{ dealRole, initEditAllEntities, initEditRoleEntities,getAllRole }, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(RoleEdit));
