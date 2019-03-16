'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Button, Table, Modal } from 'antd';

import * as MsgUtil from 'utils/MsgUtil';
import * as DateUtil from 'utils/DateUtil';
import * as Constant from 'utils/Constant';
import * as businessRoute from 'business/route';

import 'business/style/index.less';

import {
	qrySysVersionData,
	QRY_SYS_VERSION_DATA,
} from 'business/common/SysVersionDataService';
import {
	QRY_APP_STATIC_RES_BY_FORM,
	GET_APP_STATIC_RES_ITEM_BY_RES_ID,
	DEL_APP_STATIC_RES,
	DEL_APP_STATIC_RES_ITEM,
	qryAppStaticResByForm,
	deleteAppStaticRes,
	getResItemByResId,
	deleteAppStaticResItem,
} from 'action';

import SelectData from './SelectData.json';
import AppStaticResSearchForm, { AppStaticResSearchFormCacheKey } from './AppStaticResSearchForm';

const getDataKeyDesc = (key, dataList) => {
	for (const i in dataList) {
		if (key === dataList[i].key) {
			return dataList[i].desc;
		}
	}
	return '';
};

class AppStaticResAdmin extends React.Component {
    //检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		appStaticResList: PropTypes.array,
		versionInfoList: PropTypes.array,
		rspInfo: PropTypes.object,
		actionType: PropTypes.string,
		appStaticResItemList: PropTypes.array,
		actions: PropTypes.object.isRequired,
		currentAppStaticRes: PropTypes.object,
		currentAppStaticResItem: PropTypes.object,
	};

	static defaultProps = {
		appStaticResList: [],
		versionInfoList: [],
		appStaticResItemList: [],
		rspInfo: undefined,
		actionType: '',
		currentAppStaticRes: undefined,
		currentAppStaticResItem: undefined,
	};

	constructor (props) {
		super(props);
		const { currentAppStaticRes, currentAppStaticResItem } = props;
		if (currentAppStaticResItem) {
			this.state = {
				selectedAppStaticResRowKeys: [currentAppStaticResItem.resourceId],
				selectedResItemRowKeys: currentAppStaticResItem.id
					? [currentAppStaticResItem.id]
					: [],
				currentPage: 1,       //当前选中的分页
			};
		} else if (currentAppStaticRes) {
			this.state = {
				selectedAppStaticResRowKeys: currentAppStaticRes.id
					? [currentAppStaticRes.id]
					: [],
				selectedResItemRowKeys: [],
				currentPage: 1,       //当前选中的分页
			};
		} else {
			this.state = {
				selectedAppStaticResRowKeys: [],
				selectedResItemRowKeys: [],
				currentPage: 1,       //当前选中的分页
			};
		}
	};

	componentWillMount () {
		const { actions, versionInfoList } = this.props;
		if (!versionInfoList || versionInfoList.length < 1) {
			actions.qrySysVersionData({ type: Constant.VERSION_TYPE_FIRMWARE });
		}
		this.handleQuery();
		if (this.state.selectedAppStaticResRowKeys[0]) {
			actions.getResItemByResId(
				this.state.selectedAppStaticResRowKeys[0]);
		}
	}

	componentWillReceiveProps (nextProps) {
		const { actions, rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				let isRefresh = false;
				if (`${QRY_APP_STATIC_RES_BY_FORM}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询应用静态资源列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${GET_APP_STATIC_RES_ITEM_BY_RES_ID}_SUCCESS` ===
					actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询应用静态资源明细列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${QRY_SYS_VERSION_DATA}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询版本列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${DEL_APP_STATIC_RES}_SUCCESS` === actionType ||
					`${DEL_APP_STATIC_RES_ITEM}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`删除产品信息失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					} else {
						isRefresh = true;
					}
				}

				if (isRefresh) {
					this.handleQuery();
					if (this.state.selectedAppStaticResRowKeys[0]) {
						actions.getResItemByResId(
							this.state.selectedAppStaticResRowKeys[0]);
					}
				}
			}
		}
	};

	//radio选择变更事件处理
	onAppStaticResSelectChange = (selectedAppStaticResRowKeys) => {
		this.setState({ selectedAppStaticResRowKeys });
		const select = selectedAppStaticResRowKeys;
		if (select && select[0]) {
			const { actions } = this.props;
			actions.getResItemByResId(select[0]);
		}
	};

	//应用静态资源明细选择
	onResItemSelectChange = (selectedResItemRowKeys) => {
		this.setState({ selectedResItemRowKeys });
	};

	//[查询] 按钮
	handleQuery = (qryAppStaticResInfoForm) => {
		const { actions } = this.props;
		const { currentPage } = this.state;

		if (!qryAppStaticResInfoForm) {
			qryAppStaticResInfoForm = JSON.parse(
				localStorage.getItem(AppStaticResSearchFormCacheKey));
		}
		if (!qryAppStaticResInfoForm) {
			qryAppStaticResInfoForm = {};
		}
		this.setState({
			currentPage: 1
		}, () => {
			actions.qryAppStaticResByForm(qryAppStaticResInfoForm);
		});

	};

	//[新增] 应用静态资源按钮
	handleAddAppStaticRes = () => {
		this.context.router.replace(`${businessRoute.AppStaticResEdit}`);
	};

	//[新增] 发现按钮
	handleAddResItem = () => {
		const select = this.state.selectedAppStaticResRowKeys;
		if (select[0]) {
			this.context.router.replace(
				`${businessRoute.AppStaticResItemAdd}${select[0]}`);
		} else {
			MsgUtil.showwarning('请选择一条应用静态资源数据');
		}
	};

	//[修改] 按钮
	handleEditAppStaticRes = () => {
		const select = this.state.selectedAppStaticResRowKeys;
		if (select && select[0]) {
			this.context.router.replace(
				`${businessRoute.AppStaticResEdit}${select[0]}`);
		} else {
			MsgUtil.showwarning('请选择一条需要修改的应用静态资源');
		}
	};

	//[修改]应用静态资源明细按钮
	handleEditResItem = () => {
		const select = this.state.selectedResItemRowKeys;
		if (select && select[0]) {
			this.context.router.replace(
				`${businessRoute.AppStaticResItemEdit}${select[0]}`);
		} else {
			MsgUtil.showwarning('请选择需要修改的资源');
		}
	};

	//[删除] 应用静态资源按钮
	handleDeleteAppStaticRes = () => {
		const { selectedAppStaticResRowKeys } = this.state;
		const { actions, appStaticResList } = this.props;

		let currentAppStaticRes;
		const select = selectedAppStaticResRowKeys &&
			selectedAppStaticResRowKeys[0];
		if (!select) {
			MsgUtil.showwarning('请选择需要删除的应用静态资源数据？');
			return;
		}

		for (const item of appStaticResList) {
			if (item.id == select) {
				currentAppStaticRes = item;
				break;
			}
		}

		if (currentAppStaticRes) {
			Modal.confirm({
				title: `确定要删除 [模块:${currentAppStaticRes.moduleKey}, 版本:${currentAppStaticRes.versionRecId}, 分辨率:${currentAppStaticRes.resolution}] 的资源吗?`,
				content: '',
				onOk() {
					actions.deleteAppStaticRes(currentAppStaticRes);
				},
				onCancel() {
				},
			});
		} else {
			MsgUtil.showwarning('请选择需要删除的应用静态资源数据？');
		}
	};

	//[删除] 应用静态资源明细按钮
	handleDeleteDiscovery = () => {
		const { selectedResItemRowKeys } = this.state;
		const { actions, appStaticResItemList } = this.props;

		let currentAppStaticResItem;

		appStaticResItemList.forEach((item) => {
			if (item.id == selectedResItemRowKeys) {
				currentAppStaticResItem = item;
			}
		});

		if (currentAppStaticResItem) {
			Modal.confirm({
				title: '确定要删除吗?',
				content: '',
				onOk() {
					actions.deleteAppStaticResItem(currentAppStaticResItem);
				},
				onCancel() {
				},
			});
		} else {
			MsgUtil.showwarning('请选择需要删除的资源明细');
		}
	};

	//Table行选择事件
	handleRowClk = (selectedRow) => {
		this.setState({ selectedAppStaticResRowKeys: [selectedRow.id] });
		const { actions } = this.props;
		actions.getResItemByResId(selectedRow.id);
	};
	handleResItemRowClk = (selectedRow) => {
		this.setState({ selectedResItemRowKeys: [selectedRow.id] });
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
		const { appStaticResList, appStaticResItemList, versionInfoList } = this.props;
		const { selectedAppStaticResRowKeys, selectedResItemRowKeys } = this.state;
		const hasSelectedAppStaticRes = selectedAppStaticResRowKeys &&
			selectedAppStaticResRowKeys.length > 0;
		const hasSelectedDiscovery = selectedResItemRowKeys &&
			selectedResItemRowKeys.length > 0;

		const appStaticResRowSelection = {
			selectedRowKeys: selectedAppStaticResRowKeys,
			type: 'radio',
			onChange: this.onAppStaticResSelectChange,
		};
		const appStaticResColumns = [
			{
				title: '模块',
				dataIndex: 'moduleKey',
				key: 'moduleKey',
				width: 200,
				render: (text) => {
					const desc = getDataKeyDesc(text,
						SelectData.moduleKeyDataList);
					return desc ? desc : `未知模块:${text}`;
				},

			}, {
				title: '语言',
				dataIndex: 'language',
				key: 'language',
				width: 200,
			}, {
				title: '分辨率',
				dataIndex: 'resolution',
				key: 'resolution',
				width: 200,
				render: (text) => {
					const desc = getDataKeyDesc(text,
						SelectData.resolutionDataList);
					return desc ? desc : `未知分辨率:${text}`;
				},
			}, {
				title: '状态',
				width: 200,
				dataIndex: 'state',
				key: 'state',
				render: (text) => {
					const desc = getDataKeyDesc(text, SelectData.stateDataList);
					return desc ? desc : `未知状态:${text}`;
				},
			}, {
				title: '描述',
				width: 200,
				dataIndex: 'resourceDescribe',
				key: 'resourceDescribe',
			}, {
				title: '操作记录',
				width: 400,
				dataIndex: 'log',
				key: 'log',
				render(text, record) {
					return (
						<Row>
							<Row>创建人：{record.createdBy}</Row>
							<Row>创建时间：{record.createTime &&
							DateUtil.parseDateTime(record.createTime)}</Row>
							<Row>更新人：{record.updatedBy}</Row>
							<Row>更新时间：{record.updateTime &&
							DateUtil.parseDateTime(record.updateTime)}</Row>
						</Row>

					);
				},
			},
		];

		const resItemRowSelection = {
			selectedRowKeys: this.state.selectedResItemRowKeys,
			type: 'radio',
			onChange: this.onResItemSelectChange,
		};

		const resItemColumns = [
			{
				title: '资源类型',
				dataIndex: 'resourceType',
				key: 'resourceType',
				width: 200,
				render: (text) => {
					const desc = SelectData.resourceTypeMap[text];
					return desc ? desc : `未知资源类型:${text}`;
				},
			}, {
				title: '状态',
				dataIndex: 'state',
				key: 'state',
				width: 200,
				render: (text) => {
					const desc = getDataKeyDesc(text, SelectData.stateDataList);
					return desc ? desc : `未知状态:${text}`;
				},
			}, {
				title: '定制信息',
				dataIndex: 'custom',
				width: 400,
				key: 'custom',
				render: (text, record) => {
					return (
						<Row>
							<Row>标题:{record.title}</Row>
							<Row>内容:{record.content}</Row>
							<Row>序号:{record.sort}</Row>
							<Row>高度:{record.height}</Row>
							<Row>宽度:{record.width}</Row>
							<Row>开始时间:{record.beginTime &&
							DateUtil.parseDateTime(record.beginTime)}</Row>
							<Row>结束时间:{record.endTime &&
							DateUtil.parseDateTime(record.endTime)}</Row>
							<Row>触发url:{record.url}</Row>
						</Row>
					);
				},

			}, {
				title: '操作记录',
				width: 400,
				dataIndex: 'log',
				key: 'log',
				render(text, record) {
					return (
						<Row>
							<Row>创建人：{record.createdBy}</Row>
							<Row>创建时间：{record.createTime &&
							DateUtil.parseDateTime(record.createTime)}</Row>
							<Row>更新人：{record.updatedBy}</Row>
							<Row>更新时间：{record.updateTime &&
							DateUtil.parseDateTime(record.updateTime)}</Row>
						</Row>

					);
				},
			},
		];

		return (
			<div>
				<Row>
					<Col span={16} >
						<AppStaticResSearchForm
							versionInfoList={versionInfoList}
							handleQuery={this.handleQuery}
						/>
					</Col>
					<Col style={{ textAlign: 'right' }} >
						<Button
							type="primary" icon="edit"
							onClick={this.handleEditAppStaticRes}
							disabled={!hasSelectedAppStaticRes}
						>修改</Button>&nbsp;&nbsp;
						<Button
							type="primary" icon="delete"
							onClick={this.handleDeleteAppStaticRes}
							disabled={!hasSelectedAppStaticRes}
						>删除</Button>&nbsp;&nbsp;
						<Button
							type="primary" icon="plus"
							onClick={this.handleAddAppStaticRes}
						>新增应用静态资源</Button>
					</Col>
				</Row>
				<Row>
					<Col span={24} >
						&nbsp;&nbsp;
					</Col>
				</Row>
				<Row>
					<Col span={24} >
						<Table
							rowSelection={appStaticResRowSelection}
							columns={appStaticResColumns}
							rowKey={record => record.id}
							dataSource={appStaticResList}
							onRowClick={this.handleRowClk}
							pagination={this.pagination(appStaticResList)}
						/>
					</Col>
				</Row>
				<Row>
					<Col span={24} />
				</Row>
				<br />
				<Row>
					<Col span={24} className="fr" >
						<Button
							type="primary" icon="edit"
							onClick={this.handleEditResItem}
							disabled={!hasSelectedDiscovery}
						>修改</Button>
						&nbsp;&nbsp;
						<Button
							type="primary" icon="delete"
							onClick={this.handleDeleteDiscovery}
							disabled={!hasSelectedDiscovery}
						>删除</Button>
						&nbsp;&nbsp;
						<Button
							type="primary" size="large"
							onClick={this.handleAddResItem}
							disabled={!hasSelectedAppStaticRes}
						>新增资源明细</Button>
					</Col>
				</Row>
				<Row>
					<Col span={24} >
						&nbsp;&nbsp;
					</Col>
				</Row>
				<Row>
					<Col span={24} className="fr" >
						<Table
							rowSelection={resItemRowSelection}
							columns={resItemColumns}
							rowKey={record => record.id}
							dataSource={appStaticResItemList}
							onRowClick={this.handleResItemRowClk}
							expandedRowRender={record => <p>
								资源地址：{record.resourceUrl}</p>}
						/>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { versionInfoList } = state.get('SysVersionDataService').toObject();
	const { appStaticResList, appStaticResItemList, currentAppStaticRes, currentAppStaticResItem } = state.get(
		'AppStaticResService').toObject();
	return {
		rspInfo,
		actionType,
		appStaticResList,
		appStaticResItemList,
		versionInfoList,
		currentAppStaticRes,
		currentAppStaticResItem,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryAppStaticResByForm,
			deleteAppStaticRes,
			getResItemByResId,
			deleteAppStaticResItem,
			qrySysVersionData,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AppStaticResAdmin);
