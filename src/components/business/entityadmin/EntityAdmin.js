'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Col, Modal, Row, Table, Button,Icon } from 'antd';
import {
	getAllEntities,
	deleteEneity,
	ENTITY_GET_ALL_ENTITIES,
	DELETE_ENTITY,
	initEditEntity,
	qrySysMenu,
	SysEntityButtonBean,
	deleteMenus,
} from 'action';

import * as MsgUtil from 'utils/MsgUtil';
import * as Constant from 'utils/Constant';
import * as businessRoute from 'business/route';
import EntitySearchForm from './EntitySearchForm';



class EntityAdmin extends React.Component {

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		actionType: PropTypes.string.isRequired,
		actions: PropTypes.object.isRequired,
		rspInfo: PropTypes.object.isRequired,
		sysMenuList: PropTypes.array,
		params: PropTypes.object,
	};

	static defaultProps = {
		sysMenuList: [],
		params: {},
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
				if (`${ENTITY_GET_ALL_ENTITIES}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询菜单列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${DELETE_ENTITY}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`删除菜单信息失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					} else {
						isRefresh = true;
					}
				}
				if (isRefresh) {
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
	handleQuery = (qryEntityUseForm) => {
		const { actions } = this.props;
		if (!qryEntityUseForm) {
			qryEntityUseForm = {};
		}
		console.log('qryEntityUseForm', qryEntityUseForm);
		actions.qrySysMenu(qryEntityUseForm);
		this.setState({ currentPage: 1 });
	};

	//[修改] 按钮
	handleEdit = () => {
		const { actions, sysMenuList } = this.props;
		const { selectedRowKeys } = this.state;
		const { currentPage } = this.state;

		let currentMenus;
		sysMenuList.forEach((item) => {
			if (item.entId == selectedRowKeys) {
				currentMenus = item;
			}
		});

		if (currentMenus) {
			actions.initEditEntity(currentMenus, currentPage);
			this.context.router.replace(
				`${businessRoute.EntityEdit}/${currentPage}/${currentMenus.menuId}`);
		} else {
			MsgUtil.showwarning('请选择需修改的权限菜单');
		}
	};

	//[删除] 按钮
	handleDelete = (e) => {
		const {  sysMenuList, actions } = this.props;
		const { selectedRowKeys } = this.state;
		let currentMenus;
		sysMenuList.forEach((item) => {
			if (item.entId == selectedRowKeys) {
				currentMenus = item;
			}
		});

		console.log('currentMenus', currentMenus);
		if (currentMenus) {
			Modal.confirm({
				title: `所有关联[${currentMenus.moduleName}]的权限将失效，确定要删除吗?`,
				content: '',
				onOk() {
			  	actions.deleteMenus(Constant.OPER_TYPE_DELETE, currentMenus);
				},
				onCancel() {
				},
			});
		} else {
			MsgUtil.showwarning('请选择需要删除的权限菜单');
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
		const { sysMenuList } = this.props;
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
				title: '菜单ID',
				dataIndex: 'menuId',
				key: 'menuId',
			}, {
				title: '菜单类型',
				dataIndex: 'menuType',
				key: 'menuType',
			}, {
				title: '菜单名称',
				dataIndex: 'menuTitle',
				key: 'menuTitle',
			},  {
				title: '模块名称',
				dataIndex: 'moduleName',
				key: 'moduleName',
			}, {
				title: '菜单图标',
				dataIndex: 'imageUrl',
				key: 'imageUrl',
				render: (text, recond) => {
					return <Icon type={recond.imageUrl} />;
				}
			},{
				title: '父菜单ID',
				dataIndex: 'parentMenuId',
				key: 'parentMenuId',
			},{
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
						<EntitySearchForm handleQuery={this.handleQuery} />
						<Button type="primary" icon="edit" onClick={this.handleEdit} disabled={!hasSelected} >修改</Button> &nbsp;&nbsp;
						<Button type="primary" icon="delete" onClick={this.handleDelete} disabled={!hasSelected} >删除</Button>
					</Col>

					<Col span={8} style={{ textAlign: 'right' }} >
						<Button type="primary" size="large" >
							<Link to={`${businessRoute.EntityEdit}/${currentPage}`} onClick={this.handleAdd} >
								<Icon type="plus" />
								<span>&nbsp;&nbsp;&nbsp;&nbsp;新增菜单</span>
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
							dataSource={sysMenuList}
							pagination={this.pagination(sysMenuList)}
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
	const { sysMenuList } = state.get('entityadmin').toObject();
	return { actionType, rspInfo, sysMenuList };
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getAllEntities,
			deleteEneity,
			initEditEntity,
			qrySysMenu,
			SysEntityButtonBean,
			deleteMenus,
		  }, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(EntityAdmin);
