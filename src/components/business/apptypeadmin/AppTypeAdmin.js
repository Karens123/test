'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Button, Table, Modal } from 'antd';

import * as MsgUtil from 'utils/MsgUtil';
import * as businessRoute from 'business/route';
import * as Constant from 'utils/Constant';

import {
	QRY_APP_TYPE_BY_FORM,
	DEAL_APP_TYPE,
	DELETE_APP_TYPE,
	qryAppTypeByForm,
	deleteAppType,
} from 'action';
import AppTypeSearchForm, { AppTypeSearchFormCacheKey } from './AppTypeSearchForm';

class AppTypeAdmin extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		currentAppType: PropTypes.object.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actionType: PropTypes.string.isRequired,
		actions: PropTypes.object.isRequired,
		appTypeList: PropTypes.array,
		params: PropTypes.object,
	};
	static defaultProps = {
		appTypeList: [],
		params: {},
	};

	constructor (props) {
		super(props);
		const { currentAppType } = this.props;
		if (currentAppType) {
			this.state = {
				selectedRowKeys: currentAppType.appType
					? [currentAppType.appType]
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
		const { rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				let isRefresh = false;
				if (`${QRY_APP_TYPE_BY_FORM}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询App类型列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${DELETE_APP_TYPE}_SUCCESS` === actionType ||
					`${DELETE_UP_PROD_PIC}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`删除App类型信息失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					} else {
						MsgUtil.showwarning('删除App类型信息成功');
						isRefresh = true;
					}
				} else if (`${DEAL_APP_TYPE}_SUCCESS` === actionType) {
					isRefresh = true;
				}
				if (isRefresh) {
					this.handleQuery();
				}
			}
		}
	}

	//radio选择变更事件处理
	onRadioSelectChange = (selectedRowKeys) => {
		console.log('selectedRowKeys', selectedRowKeys);
		this.setState({ selectedRowKeys });
	};
	//Table行选择事件
	handleRowClk = (selectedRowKeys) => {
		this.setState({ selectedRowKeys: [selectedRowKeys.appType] });
	};

	//[查询] 按钮
	handleQuery = (qryForm) => {
		const { actions } = this.props;
		if (!qryForm) {
			qryForm = JSON.parse(
				localStorage.getItem(AppTypeSearchFormCacheKey));
		}
		if (!qryForm) {
			qryForm = {};
		}
		actions.qryAppTypeByForm(qryForm);

		this.setState({
			selectedRowKeys: [],
			currentPage: 1,       //当前选中的分页
		});
	};

	//[新增] 按钮
	handleAdd = () => {
		const { currentPage } =this.state;
		this.context.router.replace(`${businessRoute.AppTypeEdit}/${currentPage}`);
	};

	//[修改] 按钮
	handleEdit = () => {
		const select = this.state.selectedRowKeys;
		const { currentPage } =this.state;
		if (select) {
			this.context.router.replace(
				`${businessRoute.AppTypeEdit}/${currentPage}/${select}`);
		} else {
			MsgUtil.showwarning('请选择一条记录');
		}
	};

	//[删除] 按钮
	handleDelete = () => {
		const { selectedRowKeys } = this.state;
		const { actions } = this.props;//注：获取所有对象
		if (selectedRowKeys) {
			const deleteList = [];
			for (const i in selectedRowKeys) {
				deleteList.push({ appType: selectedRowKeys[i] });
			}
			Modal.confirm({
				title: `确定要删除记录 [${selectedRowKeys}] 吗?`,
				content: '',
				onOk() {
					actions.deleteAppType(deleteList);
				},
				onCancel() {
				},
			});
		} else {
			MsgUtil.showwarning('请选择需要删除的记录');
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
		const { appTypeList } = this.props;
		const { selectedRowKeys } = this.state;

		const rowSelection = {
			type: 'radio',
			onChange: this.onRadioSelectChange,
			selectedRowKeys,
		};
		const hasSelected = selectedRowKeys && selectedRowKeys.length > 0;

		const columns = [
			{
				title: '应用类型编码',
				dataIndex: 'appType',
				key: 'appType',
				width: '150px',
			}, {
				title: '应用名称',
				dataIndex: 'appName',
				key: 'appName',
				width: '150px',
			}, {
				title: '图片',
				dataIndex: 'image',
				key: 'image',
				width: '150px',
				render: text => <img src={text} width="30" />,
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
				width: '200px',
				dataIndex: 'remark',
				key: 'remark',
			}];
		return (
			<div>
				<Row>
					<Col span={14} >
						<AppTypeSearchForm handleQuery={this.handleQuery} />
					</Col>
					<Col style={{ textAlign: 'right' }} >
						<Button type="primary" icon="edit" onClick={this.handleEdit} disabled={!hasSelected} >修改</Button>&nbsp;&nbsp;
						<Button type="primary" icon="delete" onClick={this.handleDelete} disabled={!hasSelected} >删除</Button>&nbsp;&nbsp;
						<Button type="primary" size="large" icon="plus" onClick={this.handleAdd} >新增应用</Button>
					</Col>
				</Row>
				<Row><Col span={24} >&nbsp;&nbsp;</Col></Row>
				<Row>
					<Col span={24} >
						<Table
							rowSelection={rowSelection}
							columns={columns}
							rowKey={record => record.appType}
							dataSource={appTypeList}
							onRowClick={this.handleRowClk}
							pagination={this.pagination(appTypeList)}
						/>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { appTypeList, currentAppType } = state.get('AppTypeService').
		toObject();
	return { appTypeList, rspInfo, currentAppType, actionType };
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({ qryAppTypeByForm, deleteAppType },
			dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AppTypeAdmin);
