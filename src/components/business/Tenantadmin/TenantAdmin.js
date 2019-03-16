'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Modal, Row, Table } from 'antd';

import * as MsgUtil from 'utils/MsgUtil';
import * as Constant from 'utils/Constant';
import * as businessRoute from 'business/route';
import {
	QRY_TENANT_BY_FORM,
	qryTenantByForm,
	initEditTenant,
	dealTenant,
	DEAL_TENANT
} from 'action';
import TenantadminSearchForm from './TenantadminSearchForm';

class Tenantadmin extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		TenantRecords: PropTypes.array,
		currentSysUser: PropTypes.object,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		currentSelectTenant: PropTypes.object.isRequired,

	};

	static defaultProps = {
		TenantRecords: [],
		currentSysUser: undefined,
		currentSelectTenant: {},
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
	}

	componentWillReceiveProps (nextProps) {
		console.log(0);
		const {  rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			console.log(1);
			if (rspInfo) {
				console.log(2);
				let isRefresh = false;
				if (`${DEAL_TENANT}_SUCCESS` === actionType) {

					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`删除失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
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
	handleQuery = (qryTenantForm) => {
		const { actions } = this.props;
		if (!qryTenantForm) {
			qryTenantForm = {};
		}

		console.log('qryTenantForm', qryTenantForm);

		actions.qryTenantByForm(qryTenantForm);
	};

	//[新增] 发用户按钮
	handleAdd = () => {
		const { router } = this.context;
		router.replace(`${businessRoute.TenantAdd}`);
	};

	handleRowClk = (record) => {
		this.setState({ selectedRowKeys: [record.tenantId] });
	};

	//[修改] 按钮
	handleEdit = () => {
		const { actions,TenantRecords } = this.props;
		const { router } = this.context;
		const { currentPage } = this.state;
		const select = this.state.selectedRowKeys;

		let currentSelectTenant;
		TenantRecords.forEach((item) => {
			if (item.tenantId == select) {
				currentSelectTenant = item;
			}
		});

		if (select ) {
			actions.initEditTenant(currentSelectTenant, currentPage);
			router.replace(`${businessRoute.TenantEdit}`);
		} else {
			MsgUtil.showwarning('请选择一条需要修改的数据');
		}
	};
	//[删除] 按钮
	handleDelete = () => {
		const { selectedRowKeys } = this.state;
		const { actions, TenantRecords } = this.props;

		console.log('selectedRowKeys', selectedRowKeys);

		const select = selectedRowKeys && selectedRowKeys[0];
		if (!select) {
			MsgUtil.showwarning('请选择需要删除的数据？');
			return;
		}

		let currentSelectTenant;
		TenantRecords.forEach((item) => {
			if (item.tenantId == select) {
				currentSelectTenant = item;
			}
		});


		if (currentSelectTenant) {
			Modal.confirm({
				title: `确定要删除用户名称为 [${currentSelectTenant.name}] 吗?`,
				content: '',
				onOk() {
					actions.dealTenant(Constant.OPER_TYPE_DELETE, currentSelectTenant);
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
		const { TenantRecords, currentSelectTenant } = this.props;
		const { selectedRowKeys } = this.state;

		console.log('currentSelectTenant', currentSelectTenant);


		// 通过 rowSelection 对象表明需要行选择
		const rowSelection = {
			type: 'radio',
			onChange: this.onRadioSelectChange,
			selectedRowKeys,
		};
		const hasSelected = selectedRowKeys && selectedRowKeys.length > 0;

		const columns = [
			{
				title: '租户ID',
				dataIndex: 'tenantId',
				key: 'tenantId',
			}, {
				title: '商家',
				dataIndex: 'name',
				key: 'name',
			},{
				title: '地址',
				dataIndex: 'address',
				key: 'address',
			}, {
				title: '联系人',
				dataIndex: 'contactMan',
				key: 'contactMan',
			},{
				title: '头像',
				dataIndex: 'backgroundImage',
				key: 'backgroundImage',
			},  {
				title: '手机',
				dataIndex: 'regionCode',
				key: 'regionCode',
			},{
				title: '地区',
				dataIndex: 'phone',
				key: 'phone',
			},{
				title: '联系人电话',
				dataIndex: 'contactPhone',
				key: 'contactPhone',
			},{
				title: '主页',
				dataIndex: 'homePage',
				key: 'homePage',
			},{
				title: 'logo',
				dataIndex: 'logoUrl',
				key: 'logoUrl',
			},{
				title: '简介',
				dataIndex: 'introduction',
				key: 'introduction',
			},{
				title: '租户状态',
				dataIndex: 'state',
				key: 'state',
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
			}];

		return (
			<div>
				<Row>
					<Col span={18} >
						<TenantadminSearchForm handleQuery={this.handleQuery} />
					</Col>
					<Col style={{ textAlign: 'right' }} >
						<Button type="primary" icon="edit" onClick={this.handleEdit} disabled={!hasSelected} >修改</Button>&nbsp;&nbsp;
						<Button type="primary" icon="delete" onClick={this.handleDelete} disabled={!hasSelected} >删除</Button>&nbsp;&nbsp;
						<Button type="primary" icon="plus" onClick={this.handleAdd} >新增租户</Button>
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
							rowKey={record => record.tenantId}
							dataSource={TenantRecords}
							onRowClick={this.handleRowClk}
							pagination={this.pagination(TenantRecords)}
						/>
					</Col>
				</Row>
			</div>
		);
	}
}



const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { TenantRecords,currentSelectTenant } = state.get('TenantService').toObject();
	return {
		TenantRecords,
		rspInfo,
		actionType,
		currentSelectTenant,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryTenantByForm,
			initEditTenant,
			dealTenant,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Tenantadmin);
