'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Modal, Row, Table } from 'antd';
import * as MsgUtil from 'utils/MsgUtil';
import * as Constant from 'utils/Constant';

import * as businessRoute from 'business/route';

import 'business/style/index.less';

import {
	DEL_DISCOVERY,
	DEL_DISCOVERY_TYPE,
	deleteDiscovery,
	deleteDiscoveryType,
	GET_DISCOVERS_BY_DISCOVERY_TYPE_ID,
	getDiscoverysByDiscoveryTypeId,
	QRY_DISCOVERY_TYPE_BY_FORM,
	qryDiscoveryByForm,
} from 'action';
import {
	DISCOVERY_TYPE_STYLE,
	GET_STATIC_DATA_BY_CODE_TYPE,
	getStaticDataByCodeType,
} from 'business/common/StaticDataService';
import DiscoveryTypeSearchForm, { DiscoveryTypeSearchFormCacheKey } from './DiscoveryTypeSearchForm';

class DiscoveryTypeAdmin extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		discoveryTypeInfoList: PropTypes.array,
		discoveryInfoList: PropTypes.array,
		staticDataList: PropTypes.array,
		actionType: PropTypes.string.isRequired,
		actions: PropTypes.object.isRequired,
		rspInfo: PropTypes.object.isRequired,
		currentDiscoveryType: PropTypes.object.isRequired,
		currentDiscovery: PropTypes.object.isRequired,
	};

	static defaultProps = {
		discoveryTypeInfoList: [],
		discoveryInfoList: [],
		staticDataList: [],
	};

	constructor (props) {
		super(props);
		const { currentDiscoveryType, currentDiscovery } = props;
		if (currentDiscovery) {
			this.state = {
				selectedDiscoveryTypeRowKeys: [currentDiscovery.discoveryType],
				selectedDiscoveryRowKeys: currentDiscovery.discoveryId
					? [currentDiscovery.discoveryId]
					: [],
				currentPage: 1,       //当前选中的分页
			};
		} else if (currentDiscoveryType) {
			this.state = {
				selectedDiscoveryTypeRowKeys: currentDiscoveryType.discoveryTypeId
					? [currentDiscoveryType.discoveryTypeId]
					: [],
				selectedDiscoveryRowKeys: [],
				currentPage: 1,       //当前选中的分页

			};
		} else {
			this.state = {
				selectedDiscoveryTypeRowKeys: [],
				selectedDiscoveryRowKeys: [],
				currentPage: 1,       //当前选中的分页

			};
		}
	};

	componentWillMount () {
		const { actions, staticDataList } = this.props;
		if (!staticDataList || staticDataList.length < 1) {
			actions.getStaticDataByCodeType(DISCOVERY_TYPE_STYLE);
		}
		this.handleQuery();
		if (this.state.selectedDiscoveryTypeRowKeys[0]) {
			actions.getDiscoverysByDiscoveryTypeId(
				this.state.selectedDiscoveryTypeRowKeys[0]);
		}
	}

	componentWillReceiveProps (nextProps) {
		const { actions, rspInfo, actionType } = nextProps;

		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				let isRefresh = false;
				if (`${QRY_DISCOVERY_TYPE_BY_FORM}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询发现类型列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${GET_DISCOVERS_BY_DISCOVERY_TYPE_ID}_SUCCESS` ===
					actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询发现信息列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${GET_STATIC_DATA_BY_CODE_TYPE}_SUCCESS` ===
					actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询发现样式列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${DEL_DISCOVERY_TYPE}_SUCCESS` === actionType ||
					`${DEL_DISCOVERY}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`删除产品信息失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					} else {
						isRefresh = true;
					}
				}

				if (isRefresh) {
					this.handleQuery();
					if (this.state.selectedDiscoveryTypeRowKeys[0]) {
						actions.getDiscoverysByDiscoveryTypeId(
							this.state.selectedDiscoveryTypeRowKeys[0]);
					}
				}
			}
		}
	};

	//radio选择变更事件处理
	onDiscoveryTypeSelectChange = (selectedDiscoveryTypeRowKeys) => {

		this.setState({ selectedDiscoveryTypeRowKeys });
		const select = selectedDiscoveryTypeRowKeys;
		if (select && select[0]) {
			const { actions } = this.props;
			console.log('select[0]', select[0]);
			actions.getDiscoverysByDiscoveryTypeId(select[0]);
		}
	};

	//发现信息选择
	onDiscoverySelectChange = (selectedDiscoveryRowKeys) => {
		this.setState({ selectedDiscoveryRowKeys });
	};

	// Table行选择事件
	handleRowClk = (selectedRow) => {
		this.setState(
			{ selectedDiscoveryTypeRowKeys: [selectedRow.discoveryTypeId] });
		const { actions } = this.props;
		actions.getDiscoverysByDiscoveryTypeId(selectedRow.discoveryTypeId);
	};
	handleDiscoveryRowClk = (selectedRow) => {
		this.setState( { selectedDiscoveryRowKeys: [selectedRow.discoveryId] });
	};
	//[查询] 按钮
	handleQuery = (qryDiscoveryTypeInfoForm) => {
		const { actions } = this.props;
		const { currentPage } = this.state;
		if (!qryDiscoveryTypeInfoForm) {
			qryDiscoveryTypeInfoForm = JSON.parse(
				localStorage.getItem(DiscoveryTypeSearchFormCacheKey));
		}
		if (!qryDiscoveryTypeInfoForm) {
			qryDiscoveryTypeInfoForm = {};
		}
		this.setState({
			currentPage: 1
		}, () => {
			actions.qryDiscoveryByForm(qryDiscoveryTypeInfoForm);
		});

	};

	//[新增] 发现类型按钮
	handleAddDiscoveryType = () => {
		this.context.router.replace(`${businessRoute.DiscoveryTypeEdit}`);
	};

	//[新增] 发现按钮
	handleAddDiscovery = () => {
		const select = this.state.selectedDiscoveryTypeRowKeys;
		if (select[0]) {
			this.context.router.replace(
				`${businessRoute.DiscoveryAdd}${select[0]}`);
		} else {
			MsgUtil.showwarning('请选择一条发现类型数据');
		}
	};

	//[修改] 按钮
	handleEditDiscoveryType = () => {
		const select = this.state.selectedDiscoveryTypeRowKeys;
		if (select && select[0]) {
			this.context.router.replace(
				`${businessRoute.DiscoveryTypeEdit}${select[0]}`);
		} else {
			MsgUtil.showwarning('请选择一条需要修改的发现类型');
		}
	};

	//[修改]发现信息按钮
	handleEditDiscovery = () => {
		const select = this.state.selectedDiscoveryRowKeys;
		if (select && select[0]) {
			this.context.router.replace(
				`${businessRoute.DiscoveryEdit}${select[0]}`);
		} else {
			MsgUtil.showwarning('请选择一张需要修改的图片');
		}
	};

	//[删除] 发现类型按钮
	handleDeleteDiscoveryType = () => {
		const { selectedDiscoveryTypeRowKeys } = this.state;
		const { actions, discoveryTypeInfoList } = this.props;

		let currentDiscoveryType;
		const select = selectedDiscoveryTypeRowKeys &&
			selectedDiscoveryTypeRowKeys[0];
		if (!select) {
			MsgUtil.showwarning('请选择需要删除的发现类型数据？');
			return;
		}

		discoveryTypeInfoList.forEach((item) => {
			if (item.discoveryTypeId == select) {
				currentDiscoveryType = item;
			}
		});

		if (currentDiscoveryType) {
			Modal.confirm({
				title: `确定要删除发现名称为 [${currentDiscoveryType.name}] 吗?`,
				content: '',
				onOk() {
					actions.deleteDiscoveryType(currentDiscoveryType);
				},
				onCancel() {
				},
			});
		} else {
			MsgUtil.showwarning('请选择需要删除的发现类型数据？');
		}
	};

	//[删除] 发现信息按钮
	handleDeleteDiscovery = () => {
		const { selectedDiscoveryRowKeys } = this.state;
		const { actions, discoveryInfoList } = this.props;

		let currentDiscovery;
		discoveryInfoList.forEach((item) => {
			if (item.discoveryId == selectedDiscoveryRowKeys) {
				currentDiscovery = item;
			}
		});

		if (currentDiscovery) {
			Modal.confirm({
				title: '确定要删除吗?',
				content: '',
				onOk() { actions.deleteDiscovery(currentDiscovery); },
				onCancel() { },
			});
		} else {
			MsgUtil.showwarning('请选择需要删除的应用名称');
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
		const { discoveryTypeInfoList, discoveryInfoList, staticDataList } = this.props;
		const { selectedDiscoveryTypeRowKeys, selectedDiscoveryRowKeys } = this.state;
		const hasSelectedDiscoveryType = selectedDiscoveryTypeRowKeys &&
			selectedDiscoveryTypeRowKeys.length > 0;
		const hasSelectedDiscovery = selectedDiscoveryRowKeys &&
			selectedDiscoveryRowKeys.length > 0;

		// 通过 discoveryTypeRowSelection 对象表明需要行选择
		const discoveryTypeRowSelection = {
			selectedRowKeys: selectedDiscoveryTypeRowKeys,
			type: 'radio',
			onChange: this.onDiscoveryTypeSelectChange,
		};

		const discoveryTypeColumns = [
			{
				title: '类型名称',
				dataIndex: 'name',
				key: 'name',
				width: '200px',
				render: (
					text,
					discoveryType) => `[${discoveryType.discoveryTypeId}] ${discoveryType.name}`,

			}, {
				title: '样式',
				dataIndex: 'style',
				key: 'style',
				width: '200px',
				render: (style) => {
					switch (style) {
						case 1: {
							style = '一横排';
							break;
						}
						case 2: {
							style = '二横排';
							break;
						}
						case 3: {
							style = '二竖排';
							break;
						}
						case 4: {
							style = '四格';
							break;
						}
						default:
							style = '其它';
					}
					return style;
				},
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
			},
		];

		const discoveryRowSelection = {
			selectedRowKeys: this.state.selectedDiscoveryRowKeys,
			type: 'radio',
			onChange: this.onDiscoverySelectChange,
		};

		const discoveryColumns = [
			{
				title: '名称',
				dataIndex: 'name',
				key: 'name',
				width: '200px',
			}, {
				title: '发现图片',
				dataIndex: 'image',
				width: '200px',
				key: 'image',
				render: (image, discovery) =>
					<img src={image} width="70" alt={discovery.discoveryTypeId} />,
			}, {
				title: '备注',
				dataIndex: 'remark',
				key: 'remark',
				width: '200px',
			}];

		return (
			<div>
				<Row>
					<Col span={14} >
						<DiscoveryTypeSearchForm staticDataList={staticDataList} handleQuery={this.handleQuery} />
					</Col>
					<Col style={{ textAlign: 'right' }} >
						<Button type="primary" icon="edit" onClick={this.handleEditDiscoveryType} disabled={!hasSelectedDiscoveryType} >修改</Button>&nbsp;&nbsp;
						<Button type="primary" icon="delete" onClick={this.handleDeleteDiscoveryType} disabled={!hasSelectedDiscoveryType} >删除</Button>&nbsp;&nbsp;
						<Button type="primary" icon="plus" onClick={this.handleAddDiscoveryType} >新增发现类型</Button>
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
							rowSelection={discoveryTypeRowSelection}
							columns={discoveryTypeColumns}
							rowKey={record => record.discoveryTypeId}
							dataSource={discoveryTypeInfoList}
							onRowClick={this.handleRowClk}
							pagination={this.pagination(discoveryTypeInfoList)}
						/>
					</Col>
				</Row>
				<Row>
					<Col span={24} />
				</Row>
				<br /> <br /> <br /> <br />
				<Row>
					<Col span={24} className="fr" >
						<Button type="primary" icon="edit" onClick={this.handleEditDiscovery} disabled={!hasSelectedDiscovery} >修改</Button>
						&nbsp;&nbsp;
						<Button type="primary" icon="delete" onClick={this.handleDeleteDiscovery} disabled={!hasSelectedDiscovery} >删除</Button>
						&nbsp;&nbsp;
						<Button type="primary" size="large" onClick={this.handleAddDiscovery} disabled={!hasSelectedDiscoveryType} >新增发现</Button>
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
							rowSelection={discoveryRowSelection}
							columns={discoveryColumns}
							rowKey={record => record.discoveryId}
							onRowClick={this.handleDiscoveryRowClk}
							dataSource={discoveryInfoList}
						/>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { discoveryTypeInfoList, discoveryInfoList, currentDiscoveryType, currentDiscovery } = state.get(
		'DiscoveryTypeService').toObject();
	const { staticDataList } = state.get('StaticDataService').toObject();
	return {
		discoveryTypeInfoList,
		rspInfo,
		actionType,
		discoveryInfoList,
		staticDataList,
		currentDiscoveryType,
		currentDiscovery,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryDiscoveryByForm,
			deleteDiscoveryType,
			getDiscoverysByDiscoveryTypeId,
			deleteDiscovery,
			getStaticDataByCodeType,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DiscoveryTypeAdmin);
