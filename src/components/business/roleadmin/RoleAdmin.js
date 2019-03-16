'use strict';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Icon, Modal, Row, Table } from 'antd';

import * as actions from 'action';
import * as MsgUtil from 'utils/MsgUtil';
import * as Constant from 'utils/Constant';
import * as businessRoute from 'business/route';

import RoleAdminSearchForm from './roleAdminSearchForm';

class RoleAdmin extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		roles: PropTypes.array,
		currentPage: PropTypes.number,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		params: PropTypes.object,
	};

	static defaultProps = {
		roles: [],
		currentPage: 1,
		params: {},
	};

	constructor (props) {
		super(props);
		const { currentPage } = this.props;
		this.state = {
			qryRolename: '',        //角色名输入框value
			selectedRowKeys: [],    // 选择的行记录
			currentPage,//当前选中的分页
		};
	}

	componentWillMount () {
		this.handleQuery();
		const { params } =this.props;
		const { page } = params;
		if (page){
			this.setState({
				currentPage: parseInt(page)
			});
		}
	}

	componentWillReceiveProps (nextProps) {
		const { actionType, rspInfo } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				let isRefresh = false;

				if (`${actions.ROLE_GET_ALL_ROLES}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询角色失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				}
				else if (`${actions.ROLE_DEAL_ROLE}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询角色失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					} else {
						isRefresh = true;
						MsgUtil.showwarning('删除成功!');
					}
				}

				if (isRefresh == true) {
					this.handleQuery();
				}

			}
		}
	}

	//radio选择变更事件处理
	onRadioSelectChange = (selectedRowKeys) => {
		this.setState({ selectedRowKeys });
	};

	//Table行选择事件
	handleRowClk = (selRole) => {
		console.log('selRole', selRole);
		this.setState({
			selectedRowKeys: [selRole.roleId],
		});
	};

	//[查询] 按钮
	handleQuery = (qryForm) => {
		const { actions } = this.props;
		let qryAgrument = {};
		const qryRole = { roleName: '', entname: '' };
		let flag = false;

		for (const i in qryForm) {
			flag = true;
			break;
		}

		if (qryForm == undefined || flag !== true) {
			qryAgrument = { ...qryRole };
		} else {
			qryAgrument = { ...qryForm };
		}

		console.log('qryAgrument______________________________9', qryAgrument);
		actions.getAllRole(qryAgrument);
		this.setState({ currentPage: 1 });
	};

	//[修改] 按钮
	handleEdit = () => {
		const { actions, roles } = this.props;
		const { selectedRowKeys, currentPage } = this.state;

		let currentRole;
		roles.forEach((role) => {
			if (role.roleId == selectedRowKeys) {
				currentRole = role;
			}
		});

		if (currentRole) {
			actions.initEditRole(currentRole, currentPage);

			this.initEditAllEntities(Constant.ENT_TYPE_MENU);
			// actions.initEditRoleEntities(currentRole.roleId);

			this.context.router.replace(
				`${businessRoute.RoleEdit}/${currentPage}/${currentRole.roleId}`);
		} else {
			MsgUtil.showwarning('请选择需修改的角色');
		}
	};

	//[删除] 按钮
	handleDelete = (e) => {
		const { selectedRowKeys } = this.state;
		const { roles, actions } = this.props;
		let currentRole;

		roles.forEach((role) => {
			if (role.roleId == selectedRowKeys) {
				currentRole = role;
			}
		});

		if (currentRole) {
			Modal.confirm({
				title: `确定要删除角色 [${currentRole.roleName}] 吗?`,
				content: '',
				onOk() {
					actions.dealRole(Constant.OPER_TYPE_DELETE, currentRole);
				},
				onCancel() {
				},
			});
		} else {
			MsgUtil.showwarning('请选择需要删除的角色');
		}
	};

	//[新增] 按钮
	handleAdd = () => {
		this.initEditAllEntities(Constant.ENT_TYPE_MENU);
	};

	initEditAllEntities = (entType) => {
		const { actions } = this.props;
		actions.initEditAllEntities(entType);
	};

	//表格分页
	pagination (data) {
		const component = this;
		return {
			total: data.length,
			current: component.state.currentPage,
			showSizeChanger: true,
			onShowSizeChange(current, pageSize) {
				component.setState({ currentPage: 1 });
			},
			onChange(current) {
				component.setState({ currentPage: current });
			},
		};
	}

	render () {
		const { roles } = this.props;
		const { selectedRowKeys,currentPage } = this.state;

		// 通过 rowSelection 对象表明需要行选择
		const rowSelection = {
			type: 'radio',
			onChange: this.onRadioSelectChange,
			selectedRowKeys,
		};

		const hasSelected = selectedRowKeys && selectedRowKeys.length > 0;

		const columns = [
			{
				title: '角色名称',
				dataIndex: 'roleName',
				key: 'roleName',
				width: '200px',
				sorter: (a, b) => a.roleName.length - b.roleName.length,
				render: (
					text, record) => `[${record.roleId}] ${record.roleName}`,
			}, {
				title: '状态',
				dataIndex: 'state',
				key: 'state',
				width: '200px',
				render: (text) => {
					if (text == 'U') {
						return '[U]-正常';
					} else if (text == 'E') {
						return '[E]-禁用';
					} else {
						return '未知';
					}
				},
				onFilter: (value, record) => record.state.indexOf(value) === 0,
				filters: [
					{
						text: '[U] 正常',
						value: 'U',
					}, {
						text: '[E] 正常',
						value: 'E',
					}],
			}, {
				title: '备注',
				dataIndex: 'remark',
				key: 'remark',
			}];

		return (
			<div>
				<Row>
					<Col span={16} >
						<RoleAdminSearchForm handleQuery={this.handleQuery} />
						<Button type="primary" icon="edit" onClick={this.handleEdit} disabled={!hasSelected} >修改</Button> &nbsp;&nbsp;
						<Button type="primary" icon="delete" onClick={this.handleDelete} disabled={!hasSelected} >删除</Button>
					</Col>
					<Col style={{ textAlign: 'right' }} >
						<Button type="primary" size="large" >
							<Link to={`${businessRoute.RoleAdd}/${currentPage}`} onClick={this.handleAdd} >
								<Icon type="plus" />
								<span>&nbsp;&nbsp;&nbsp;&nbsp;新增角色</span>
							</Link>
						</Button> &nbsp;
					</Col>
				</Row>
				<Row>
					<Col span={24} >&nbsp;
					</Col>
				</Row>
				<Row>
					<Col span={24} >
						<Table
							rowSelection={rowSelection}
							columns={columns}
							rowKey={record => record.roleId}
							dataSource={roles}
							pagination={this.pagination(roles)}
							onRowClick={this.handleRowClk}
						/>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { roles, refreshData, currentPage } = state.get('roleadmin').
		toObject();
	return {
		roles: roles ? roles : [],
		rspInfo,
		refreshData,
		currentPage,
		actionType,
	};
};

const mapDispatchToProps = (dispatch) => {
	const { getAllRole, initEditRole, dealRole, initEditAllEntities, initEditRoleEntities } = actions;
	return {
		actions: bindActionCreators({
			getAllRole,
			initEditRole,
			dealRole,
			initEditAllEntities,
			initEditRoleEntities,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(RoleAdmin);
