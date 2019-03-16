'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Modal, Row, Table } from 'antd';

import * as MsgUtil from 'utils/MsgUtil';
import * as Constant from 'utils/Constant';
import * as businessRoute from 'business/route';
import {
	DEAL_SYS_USER,
	DEL_SYS_USER,
	deleteSysUser,
	QRY_SYS_USER_BY_FORM,
	qrySysUserByForm,
} from 'action';
import SysUserSearchForm from './SysUserSearchForm';

class SysUserAdmin extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		sysUserList: PropTypes.array,
		currentSysUser: PropTypes.object,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		params: PropTypes.object,
	};

	static defaultProps = {
		sysUserList: [],
		currentSysUser: undefined,
		params: {},
	};

	constructor (props) {
		super(props);
		const { actions, currentSysUser } = props;
		if (currentSysUser) {
			this.state = {
				selectedRowKeys: currentSysUser.userId
					? [currentSysUser.userId]
					: [],
				currentPage: 1,       //当前选中的分页
			};
		} else {
			this.state = {
				selectedRowKeys: [],
				currentPage: 1,       //当前选中的分页
			};
		}
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
		const { actions, rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				let isRefresh = false;
				if (`${QRY_SYS_USER_BY_FORM}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询产品类型列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${DEAL_SYS_USER}_SUCCESS` === actionType) {
					isRefresh = true;
				} else if (`${DEL_SYS_USER}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`删除系统用户信息失败,错误信息; ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					} else {
						isRefresh = true;
					}
				}
				if (isRefresh) {
					this.handleQuery();
				}
			}
		}
	}

	//radio选择变更事件处理
	onRadioSelectChange = (selectedRowKeys) => {
		this.setState({ selectedRowKeys });
	};

	//[查询] 按钮
	handleQuery = (qrySysUserForm) => {
		const { actions } = this.props;
		if (!qrySysUserForm) {
			qrySysUserForm = {};
		}
		this.setState({
			currentPage: 1
		},() => {
			actions.qrySysUserByForm(qrySysUserForm);
		});

	};

	//[新增] 发用户按钮
	handleAdd = () => {
		const { router } = this.context;
		const { currentPage } = this.state;
		router.replace(`${businessRoute.SysUserEdit}/${currentPage}`);
	};

	handleRowClk = (record) => {
		this.setState({ selectedRowKeys: [record.userId] });
	};

	//[修改] 按钮
	handleEdit = () => {
		const { router } = this.context;
		const { currentPage } = this.state;
		const select = this.state.selectedRowKeys;
		if (select && select[0]) {
			router.replace(`${businessRoute.SysUserEdit}/${currentPage}/${select[0]}`);
		} else {
			MsgUtil.showwarning('请选择一条需要修改的数据');
		}
	};
	//[删除] 按钮
	handleDelete = () => {
		const { selectedRowKeys } = this.state;
		const { actions, sysUserList } = this.props;

		const select = selectedRowKeys && selectedRowKeys[0];
		if (!select) {
			MsgUtil.showwarning('请选择需要删除的数据？');
			return;
		}

		let currentSysUser;
		sysUserList.forEach((item) => {
			if (item.userId == select) {
				currentSysUser = item;
			}
		});

		if (currentSysUser) {
			Modal.confirm({
				title: `确定要删除用户名称为 [${currentSysUser.name}] 吗?`,
				content: '',
				onOk() {
					actions.deleteSysUser(currentSysUser);
				},
				onCancel() {
				},
			});
		} else {
			MsgUtil.showwarning('请选择需要删除的数据？');
		}
	};

	//表格分页
	pagination = (data) => {
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
	};

	render () {
		const { sysUserList } = this.props;
		const { selectedRowKeys } = this.state;



		// 通过 rowSelection 对象表明需要行选择
		const rowSelection = {
			type: 'radio',
			onChange: this.onRadioSelectChange,
			selectedRowKeys,
		};
		const hasSelected = selectedRowKeys && selectedRowKeys.length > 0;

		const columns = [
			{
				title: '用户名',
				dataIndex: 'username',
				key: 'username',
				width: '200px',
				render: (text, user) => `[${user.userId}] ${user.username}`,
			}, {
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
				width: '200px',
			}, {
				title: '账号提供商',
				dataIndex: 'provider',
				key: 'provider',
				width: '200px',
			}, {
				title: '状态',
				dataIndex: 'state',
				key: 'state',
				width: '200px',
				render: (text) => {
					if (text == 'U') {
						return '[U] 正常';
					} else if (text == 'E') {
						return '[E] 禁用';
					} else {
						return '未知';
					}
				},
			}, {
				title: '备注',
				dataIndex: 'remark',
				key: 'remark',
			}, {
				title: '',
				key: 'operation',
			}];

		return (
			<div>
				<Row>
					<Col span={18} >
						<SysUserSearchForm handleQuery={this.handleQuery} />
					</Col>
					<Col style={{ textAlign: 'right' }} >
						<Button type="primary" icon="edit" onClick={this.handleEdit} disabled={!hasSelected} >修改</Button>&nbsp;&nbsp;
						<Button type="primary" icon="delete" onClick={this.handleDelete} disabled={!hasSelected} >删除</Button>&nbsp;&nbsp;
						<Button type="primary" icon="plus" onClick={this.handleAdd} >新增用户</Button>
					</Col>
				</Row>

				<Row>
					<Col span={24} >&nbsp;</Col>
				</Row>
				<Row>
					<Col span={24} >
						<Table
							rowSelection={rowSelection}
							columns={columns}
							rowKey={record => record.userId}
							dataSource={sysUserList}
							onRowClick={this.handleRowClk}
							pagination={this.pagination(sysUserList)}
						/>
					</Col>
				</Row>
			</div>
		);
	}
}

function mapStateToProps (state) {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { sysUserList, currentSysUser } = state.get('SysUserService').
		toObject();
	return {
		sysUserList,
		rspInfo,
		actionType,
		currentSysUser,
	};
}

function mapDispatchToProps (dispatch) {
	return {
		actions: bindActionCreators({
			qrySysUserByForm, deleteSysUser,
		}, dispatch),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(SysUserAdmin);
