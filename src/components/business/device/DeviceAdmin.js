'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Pagination, Row, Table } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

import * as MsgUtil from 'utils/MsgUtil';
import * as businessRoute from 'business/route';
import * as Constant from 'utils/Constant';

import {
	delDevice,
	GEN_DEVICE_SN,
	IMPORT_DEVICE_SN_BY_EXCEL,
	PAGE_QRY_DEVICE_BY_FORM,
	pageQryDeviceByForm,
	qryProdForSelect,
} from 'action';

import DeviceSearchForm, { DeviceSearchFormCacheKey } from './DeviceSearchForm';

class DeviceAdmin extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		deviceInfoList: PropTypes.array,
		prodInfoList: PropTypes.array,
		total: PropTypes.number,
		rspInfo: PropTypes.object.isRequired,
		actionType: PropTypes.string.isRequired,
		actions: PropTypes.object.isRequired,
	};

	static defaultProps = {
		deviceInfoList: [],
		prodInfoList: [],
		total: 0,
	};

	constructor (props) {
		super(props);
		this.state = {
			pageSize: 10,
			currentPage: 1,
			total: 0,
		};
	}

	componentWillMount () {
		const { actions } = this.props;
		actions.qryProdForSelect();
		this.handleQuery();
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				let isRefresh = false;
				if (`${PAGE_QRY_DEVICE_BY_FORM}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${GEN_DEVICE_SN}_SUCCESS` === actionType ||
					`${IMPORT_DEVICE_SN_BY_EXCEL}_SUCCESS` === actionType) {
					isRefresh = true;
				}
				if (isRefresh) {
					this.handleQuery();
				}
			}
		}
	}

	//分页器页面大小变更
	onPaginationShowSizeChange = (currentPage, pageSize) => {
		this.setState({ currentPage, pageSize, }, () => {
			this.searchDevice();
		});
	};

	//分页器跳转
	onPaginationChange = (current) => {
		this.setState({
			currentPage: current,
		}, () => {
			this.searchDevice();
		});
	};

	//[查询] 按钮
	handleQuery = (qryDeviceInfoForm) => {
		this.setState({
			currentPage: 1,
		}, () => {
			this.searchDevice(qryDeviceInfoForm);
		});
	};

	//查询设备信息
	searchDevice = (qryDeviceInfoForm) => {
		if (!qryDeviceInfoForm) {
			qryDeviceInfoForm = JSON.parse(
				localStorage.getItem(DeviceSearchFormCacheKey));
		}
		if (!qryDeviceInfoForm) {
			qryDeviceInfoForm = {};
		}
		const { actions } = this.props;
		const { currentPage, pageSize } = this.state;
		actions.pageQryDeviceByForm(qryDeviceInfoForm, currentPage, pageSize);
	};

	//excel导入按钮
	handleImportExcel = () => {
		this.context.router.replace(businessRoute.DeviceImportByExcel);
	};

	//生成按钮
	handleGen = () => {
		this.context.router.replace(businessRoute.DeviceGen);
	};

	render () {
		const { deviceInfoList, prodInfoList } = this.props;

		const columns = [
			{
				title: '订单编号',
				dataIndex: 'orderSn',
				key: 'orderSn',
				width: 150,
			}, {
				title: '产品编号',
				dataIndex: 'prodId',
				key: 'prodId',
				width: 200,
				render: (prodId) => {
					let prodName;
					for (const k in prodInfoList) {
						if (prodInfoList[k].prodId === prodId) {
							prodName = prodInfoList[k].prodName;
							break;
						}
					}
					return `${prodId}-${(prodName ? prodName : '未知')}`;
				},
			}, {
				title: '吻吻序列号',
				dataIndex: 'wenwenSn',
				key: 'wenwenSn',
				width: 300,
			}, {
				title: '厂商',
				dataIndex: 'prodId',
				key: 'factory',
				width: 120,
				render: (prodId) => {
					let factory = '';
					for (const k in prodInfoList) {
						if (prodInfoList[k].prodId === prodId) {
							factory = prodInfoList[k].factory;
							break;
						}
					}
					return factory;
				},
			}, {
				title: '设备类型',
				dataIndex: 'prodId',
				key: 'deviceType',
				width: 120,
				render (prodId) {
					let deviceType = '';
					for (const k in prodInfoList) {
						if (prodInfoList[k].prodId === prodId) {
							deviceType = prodInfoList[k].prodType;
							break;
						}
					}
					switch (deviceType) {
						case 1: {
							return '1-戒指';
						}
						case 2: {
							return '2-手串';
						}
						case 3: {
							return '3-项链';
						}
						case 4: {
							return '4-手链';
						}
						default:
							return '其它';
					}
				},
			}, {
				title: '主板类型',
				dataIndex: 'prodId',
				key: 'mboardType',
				width: 120,
				render(prodId) {
					let mboardType = '';
					for (const k in prodInfoList) {
						if (prodInfoList[k].prodId === prodId) {
							mboardType = prodInfoList[k].mboardType;
							break;
						}
					}
					switch (mboardType) {
						case '1': {
							return '1-椭圆';
						}
						case '2': {
							return '2-方型';
						}
						default: {
							return '其它';
						}
					}
				},
			}, {
				title: '是否已激活',
				dataIndex: 'state',
				key: 'state',
				width: '150px',
				render(state) {
					switch (state) {
						case 0: {
							return '0-未激活';
						}
						case 1: {
							return '1-已激活';
						}
						default: {
							return `${state}-未知`;
						}
					}
				},
			}, {
				title: '创建时间',
				dataIndex: 'createTime',
				key: 'createTime',
				width: '260px',
				render: createTime => createTime &&
				moment(createTime).format('YYYY-MM-DD HH:mm:ss'),
			}, {
				title: '备注',
				dataIndex: 'remark',
				key: 'remark',
			}];

		return (
			<div>
				<Row>
					<Col span={24} >
						<DeviceSearchForm prodInfoList={prodInfoList} handleQuery={this.handleQuery} />
						<span style={{ float: 'right' }} > &nbsp;&nbsp;
							<Button type="primary" icon="plus" size="large" onClick={this.handleImportExcel} >excel导入</Button> &nbsp;&nbsp;
							<Button type="primary" icon="plus" size="large" onClick={this.handleGen} >生成</Button>
						</span>
					</Col>
				</Row>
				<Row>
					<Col span={24} >   &nbsp;&nbsp;</Col>
				</Row>
				<Row>
					<Col span={24} >
						<Table
							columns={columns}
							dataSource={deviceInfoList} pagination={false}
							rowKey={
								record => record.wenwenSn
							}
						/>
						<Pagination
							className="ant-table-pagination"
							showSizeChanger
							onShowSizeChange={this.onPaginationShowSizeChange}
							onChange={this.onPaginationChange}
							total={this.props.total}
							current={this.state.currentPage}
						/>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo } = state.get('RootService').toObject();
	const { deviceInfoList, prodInfoList, total } = state.get('DeviceService').
		toObject();
	return { deviceInfoList, rspInfo, prodInfoList, total };
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(
			{ pageQryDeviceByForm, qryProdForSelect, delDevice }, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceAdmin);
