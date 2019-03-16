'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Col, Modal, Row, Table, Button,Icon } from 'antd';
import {
	ENTITY_GET_ALL_ENTITIES,
	Edit_DEAL_SYS_BUTTON,
	initSysEntityButton,
	getAllEntitiesButton,
	deleteEneity,
	initEditEntity,
	qrySysMenu,
	SysEntityButtonBean,
	dealSysButton
} from 'action';

import * as MsgUtil from 'utils/MsgUtil';
import * as Constant from 'utils/Constant';
import * as businessRoute from 'business/route';
import SysButtonAdminSearchForm from './SysButtonAdminSearchForm';

class SysButtonAdmin extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		entities: PropTypes.array,
		actionType: PropTypes.string.isRequired,
		actions: PropTypes.object.isRequired,
		rspInfo: PropTypes.object.isRequired,
		sysButtonList: PropTypes.array,
	};

	static defaultProps = {
		entities: [],
		sysButtonList: []
	};

	constructor (props) {
		super(props);
		this.state = {
			selectedRowKeys: [],    // 选择的行记录
			currentPage: 1,//当前选中的分页
		};
	}

	componentWillMount () {
		this.handleQuery();
	}

	componentWillReceiveProps (nextProps) {
		const {  rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				let isRefresh = false;
				if (`${ENTITY_GET_ALL_ENTITIES}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询实体列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${Edit_DEAL_SYS_BUTTON}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`删除实体信息失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					} else {
						isRefresh = true;
					}
				}
				if (isRefresh) {
					console.log('7');
					this.handleQuery();
				}
			}
		}
	};

	//radio选择变更事件处理
	onRadioSelectChange = (selectedRowKeys) => {
		this.setState({ selectedRowKeys });
	};

	//Table行选择事件
	handleRowClk = (selEntity) => {
		this.setState({
			selectedRowKeys: [selEntity.entId],
		});
	};
	//[查询] 按钮
	handleQuery = (qryForm) => {
		const { actions } = this.props;
		if (!qryForm) {
			qryForm = {};
		}
		actions.getAllEntitiesButton(qryForm);
		this.setState({ currentPage: 1 });
	};

	//[修改] 按钮
	handleEdit = () => {
		const { actions, sysButtonList } = this.props;
		const { selectedRowKeys } = this.state;
		const { currentPage } = this.state;

		let currentSysbutton;
		sysButtonList.forEach((item) => {
			if (item.entId == selectedRowKeys) {
				currentSysbutton = item;
			}
		});

		if (currentSysbutton) {
			actions.initSysEntityButton(currentSysbutton, currentPage);
			this.context.router.replace(businessRoute.SysbuttonEdit);
		} else {
			MsgUtil.showwarning('请选择需修改的权限实体');
		}
	};

	//[删除] 按钮
	handleDelete = (e) => {
		const { selectedRowKeys } = this.state;
		const { sysButtonList,actions } = this.props;

		let currentSysButton;
		sysButtonList.forEach((item) => {
			if (item.entId == selectedRowKeys) {
				currentSysButton = item;
			}
		});
		if (currentSysButton) {
			Modal.confirm({
				title: `确定要删除权限实体 [${currentSysButton.buttonName}] 吗?`,
				content: '',
				onOk() {
			  	actions.dealSysButton(Constant.OPER_TYPE_DELETE, currentSysButton);
				},
				onCancel() {
				},
			});
		} else {
			MsgUtil.showwarning('请选择需要删除的权限实体');
		}
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
		const { entities, sysButtonList } = this.props;
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
				title: '功能ID',
				dataIndex: 'buttonId',
				key: 'buttonId',
			},{
				title: '功能名称',
				dataIndex: 'buttonName',
				key: 'buttonName',

			},{
				title: '功能code',
				dataIndex: 'buttonCode',
				key: 'buttonCode',
			},{
				title: '菜单ID',
				dataIndex: 'menuId',
				key: 'menuId',

			},  {
				title: '功能状态',
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
				onFilter: (value, record) => record.state.indexOf(value) === 0,
				filters: [
					{
						text: '[U] 正常',
						value: 'U',
					}, {
						text: '[E] 禁用',
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
						<SysButtonAdminSearchForm handleQuery={this.handleQuery} />
						<Button type="primary" icon="edit" onClick={this.handleEdit} disabled={!hasSelected} >修改</Button> &nbsp;&nbsp;
						<Button type="primary" icon="delete" onClick={this.handleDelete} disabled={!hasSelected} >删除</Button>
					</Col>

					<Col span={8} style={{ textAlign: 'right' }} >
						<Button type="primary" size="large" >
							<Link to={businessRoute.SysbuttonAdd} onClick={this.handleAdd} >
								<Icon type="plus" />
								<span>&nbsp;&nbsp;&nbsp;&nbsp;新增功能</span>
							</Link>
						</Button> &nbsp;
					</Col>
				</Row>
				<Row style={{ height: 25 }}>&nbsp;</Row>
				<Row>
					<Col span={24} >
						<Table
							rowSelection={rowSelection}
							columns={columns}
							rowKey={record => record.entId}
							dataSource={sysButtonList}
							pagination={this.pagination(sysButtonList)}
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
	const { entities, sysButtonList, currentSysButton } = state.get('entityadmin').toObject();
	return { entities, actionType, rspInfo, sysButtonList, currentSysButton };
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			initSysEntityButton,
			getAllEntitiesButton,
			deleteEneity,
			initEditEntity,
			qrySysMenu,
			SysEntityButtonBean,
			dealSysButton,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SysButtonAdmin);
