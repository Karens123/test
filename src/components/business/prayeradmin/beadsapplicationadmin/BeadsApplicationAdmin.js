'use strict';

import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
	Col,
	Row,
	Table,
	Tabs,
	Select,
	Pagination,
	Modal,
	Input,
	Form,
	Icon,
	Menu,
	Button,
} from 'antd';
import * as MsgUtil from 'utils/MsgUtil';
import * as Constant from 'utils/Constant';
import * as DateUtil from 'utils/DateUtil';
import * as Immutable from 'immutable';
import LogisticsConfig from 'res/LogisticsConfig';
import {
	qryBeadsApplication,
	assignBeads,
	ASSIGN_BEADS,
	QRY_BEADS_APPLICATION_LIST,
} from 'action';
import './index.less';
import BeadsApplicationSearchForm, {BeadsApplicationSearchFormCacheKey} from './BeadsApplicationSearchForm';

import BeadsAssignForm from './BeadsAssignForm';


const logisticsModeMap = {
	0: '不配送',
	1: '快递运输',
	2: '上门自提',
};
class BeadsApplicationAdmin extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired,
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		beadsApplicationList: PropTypes.array,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
	};

	static defaultProps = {
		params: {},
		beadsApplicationList: [],
	};

	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			currentPage: 1,
			pageSize: 10,
		};
	}

	componentWillMount() {
		this.handleQuery();
	}

	componentWillReceiveProps(nextProps, nextState) {
		const {actions, rspInfo, actionType} = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				let isRefresh = false;
				if (`${QRY_BEADS_APPLICATION_LIST}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询佛珠申领列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${ASSIGN_BEADS}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`分配佛珠失败 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					} else {
						this.onBeadsAssignCancel();
						MsgUtil.showinfo('分配佛珠成功');
						isRefresh = true;
					}
				}

				if (isRefresh) {
					this.handleQuery();
					if (this.state.selectedActivityRowKeys[0]) {
						actions.getActivityDetailByActivityId(
							this.state.selectedActivityRowKeys[0]);
					}
				}
			}
		}
	};

	//[查询] 按钮
	handleQuery = (record, stateList) => {
		const {actions} = this.props;
		if (!record) {
			record = JSON.parse(
				localStorage.getItem(BeadsApplicationSearchFormCacheKey));
		}
		if (!record) {
			record = {};
		}
		if (!stateList || !(stateList instanceof Array)) {
			stateList = [];
		}
		this.setState({
			currentPage: 1,
		}, () => {
			const {currentPage, pageSize} = this.state;
			actions.qryBeadsApplication(record, stateList, currentPage,
				pageSize);
		});

	};

	handleChange = (selectChannel) => {
		this.setState({
			selectChannel,
		});
	};

	//Table行选择事件
	handleRowClk = (records) => {
		this.setState({
			selectedRowKeys: [records.goodsId],
		});
	};
	//表格分页
	pagination = (data) => {
		const component = this;
		return {
			total: data.length,
			current: component.state.currentPage,
			showSizeChanger: true,
			onShowSizeChange(current, pageSize) {
				component.setState({currentPage: 1, pageSize});
			},
			onChange(current) {
				component.setState({currentPage: current});
			},
		};
	};

	//佛珠分配提交
	onBeadsAssignSubmit = () => {
		const beadsAssignFormRef = this.beadsAssignFormRef;
		const {form} = beadsAssignFormRef.props;
		const {actions} = this.props;
		form.validateFields((errors, editForm) => {
			if (!!errors) {
				console.log('表单验证失败!!!', errors);
				return;
			}
			console.log('editForm ============', editForm);
			editForm.createTime = undefined;
			actions.assignBeads(editForm);
		});
	};
	onBeadsAssignCancel = () => {
		this.setState({visible: false});
		this.beadsAssignFormRef = undefined;
	};

	saveFormRef = (beadsAssignFormRef) => {
		this.beadsAssignFormRef = beadsAssignFormRef;
	};

	render() {
		const columns = [
			{
				title: '申请id',
				dataIndex: 'applicationId',
				key: 'applicationId',
			}, {
				title: '申请时间',
				dataIndex: 'createTime',
				key: 'createTime',
				render: createTime => createTime &&
					DateUtil.parseDateTime(createTime),
			},
			{
				title: '申请人',
				dataIndex: 'wenwenId',
				key: 'wenwenId',
			}, {
				title: '功德主',
				dataIndex: 'meritHolder',
				key: 'meritHolder',
			}, {
				title: '订单id	',
				dataIndex: 'orderId',
				key: 'orderId',
				width: 180,
			}, {
				title: '收货信息',
				dataIndex: 'address',
				key: 'address',
				width: 350,
				render: (text, record) => {
					return [
						<div>收货人:{record.recieveName}</div>,
						<div>联系方式:{record.recievePhone}</div>,
						<div>收货地址:{record.recieveAddress}</div>,
					];
				},
			},
			{
				title: '申请处理信息',
				dataIndex: 'handleMsg',
				key: 'handleMsg',
				width: 350,
				render: (text, record) => {
					if (record.state === 0) {
						return '待处理';
					} else {
						return [
							<div>处理人:{record.handlerId}</div>,
							<div>处理时间:{DateUtil.parseDateTime(record.handleTime)}</div>,
							<div>分配wenwenSn:{record.wenwenSn}</div>,
							<div>物流方式:{record.logisticsMode && logisticsModeMap[record.logisticsMode]}</div>,//0-不配送 1-快递运输 2-上门自提
							<div>物流商:{record.bussinessName && LogisticsConfig[record.bussinessName] && LogisticsConfig[record.bussinessName].label}</div>,
							<div>物流单号:{record.logisticsTradeNo}</div>,
						];
					}

				},
			},
			{
				title: '状态',
				dataIndex: 'state',
				key: 'state',
				render: (state) => {
					if (state === 0) {
						return '待分配';
					} else if (state === 2) {
						return '待收货';
					} else if (state === 3) {
						return '已完成';
					}
					return state;
				},
			},
			{
				title: '操作',
				dataIndex: 'action',
				key: 'action',
				width: 200,
				render: (text, record) => {
					if (record.state === 0) {
						return (
							<button
								onClick={
									() => {
										this.setState({
											visible: true,
											currentApplication: record,
										});
									}
								}
							>
								分配佛珠
							</button>
						);
					}
					return null;
				},
			},
		];

		const {beadsApplicationList} = this.props;
		const {visible, currentApplication} = this.state;
		return (<div className="buy-order-admin">
			<Row>
				<Col span={24}>
					<h3 style={{
						fontSize: '36px',
						marginBottom: '20px',
					}}>免费申领佛珠管理 / Apply</h3>
				</Col>
			</Row>
			<Row>
				<Col span={24}>
					<BeadsApplicationSearchForm handleQuery={this.handleQuery}/>
				</Col>
			</Row>
			<Row>
				<Col>
					<div className="admin-main div_relative">
						<Table
							dataSource={beadsApplicationList}
							columns={columns}
							rowKey="applicationId"
							onRowClick={this.handleRowClk}
							pagination={this.pagination(beadsApplicationList)}
						/>
					</div>
				</Col>
			</Row>
			<BeadsAssignForm
				wrappedComponentRef={this.saveFormRef}
				visible={visible}
				application={currentApplication}
				onCancel={this.onBeadsAssignCancel}
				onSubmit={this.onBeadsAssignSubmit}
			/>
		</div>);
	}
}

const mapStateToProps = (state) => {
	const stateObje = {
		...state.get('RootService').toObject(),
		...state.get('PrayerBeadsApplicationService').toObject(),
	};
	return stateObje;
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryBeadsApplication,
			assignBeads,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	BeadsApplicationAdmin);
