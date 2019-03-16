'use strict';

import React, { PropTypes } from 'react';
import { Col, Icon, Pagination, Row, Table } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import 'business/style/index.less';
import { qryDevice } from 'action';
import DeviceActivationSearchForm from './DeviceActivationSearchForm';

class DeviceActivationManagement extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		deviceList: PropTypes.array,
		totalCount: PropTypes.number,
		actions: PropTypes.object.isRequired,
	};

	static defaultProps = {
		deviceList: [],
		totalCount: 0,
	};

	constructor (props) {
		super(props);
		this.state = {
			pageSize: 10,
			currentPage: 1,
		};
	}

	componentWillMount () {
		// this.pageQryDevice();
	}

	//分页器页面大小变更
	onPaginationShowSizeChange = (currentPage, pageSize) => {
		this.setState({ currentPage, pageSize }, () => {
			this.pageQryDevice();
		});
	};

	//分页器跳转
	onPaginationChange = (currentPage) => {
		this.setState({ currentPage }, () => {
			this.pageQryDevice();
		});
	};

	handleQuery = (qryBeanForm, beginActivitedTime, endActivitedTime) => {
		this.setState({
			currentPage: 1,
			beginActivitedTime,
			endActivitedTime
		},
			() => {
				this.pageQryDevice(qryBeanForm, this.state.beginActivitedTime,
					this.state.endActivitedTime);
			});
	};
	//分页查询设备信息
	pageQryDevice = (qryBeanForm, beginActivitedTime, endActivitedTime) => {
		if (!qryBeanForm) {
			qryBeanForm = {};
		}
		if (!beginActivitedTime) {
			beginActivitedTime = this.state.beginActivitedTime;
		}
		if (!endActivitedTime) {
			endActivitedTime = this.state.endActivitedTime;
		}
		const { currentPage, pageSize } = this.state;
		this.props.actions.qryDevice(qryBeanForm, currentPage, pageSize,
			beginActivitedTime, endActivitedTime);
	};

	//Table行选择事件
	handleRowClk = (records) => {
		console.log('records', records);
		// this.setState({
		//     selectedRowKeys:[records.recId]
		// })
	};


	render () {

		console.log('this.props.totalCount', this.props.totalCount);

		const columns = [
			{
				title: '吻吻序列号',
				dataIndex: 'wenwenSn',
				key: 'wenwenSn',
				width: '300px',
			}, {
				title: '吻吻ID',
				dataIndex: 'wenwenId',
				key: 'wenwenId',
				width: '100px',
			}, {
				title: '国家',
				dataIndex: 'country',
				width: '100px',
				key: 'country',
			}, {
				title: '省份',
				dataIndex: 'province',
				width: '100px',
				key: 'province',
			}, {
				title: '城市',
				dataIndex: 'city',
				width: '100px',
				key: 'city',
			}, {
				title: '区',
				dataIndex: 'district',
				width: '100px',
				key: 'district',
			}, {
				title: '街道',
				dataIndex: 'township',
				width: '400px',
				key: 'township',
			}, {
				title: '状态',
				dataIndex: 'state',
				key: 'state',
				width: '100px',
				render: (text, device) => (device.state === 0) ? '未激活' : '已激活',
			}, {
				title: '激活时间',
				dataIndex: 'activateTime',
				key: 'activateTime',
				width: '260px',
				render: activateTime => activateTime &&
				moment(activateTime).format('YYYY-MM-DD HH:mm:ss'),
			}];

		const { deviceList } = this.props;

		return (
			<Row>
				<header style={{ marginBottom: '10px' }} >
					<Icon
						type="area-chart"
						style={{
							fontSize: 21,
							color: '#2db7f5',
						}}
					/>设备激活统计
				</header>
				<Row>
					<Col span={20} >
						<DeviceActivationSearchForm handleQuery={this.handleQuery} />
					</Col>
				</Row>
				<Row>&nbsp;</Row>
				<Row>
					<Col>
						<Table
							columns={columns}
							dataSource={deviceList}
							rowKey={record => record.wenwenSn}
							onRowClick={this.handleRowClk}
							pagination={false}
						/>
						{((() => {
							if (this.props.totalCount) {
								return (
									<Pagination
										className="ant-table-pagination"
										showSizeChanger
										onShowSizeChange={this.onPaginationShowSizeChange}
										onChange={this.onPaginationChange}
										total={this.props.totalCount}
										current={this.state.currentPage}
									/>
								);
							}
						})())}
					</Col>
				</Row>
			</Row>
		);
	}
}

const mapStateToProps = (state) => {
	const { deviceList, totalCount, currentPage } = state.get(
		'DeviceActivationService').toObject();
	return {
		deviceList,
		totalCount,
		currentPage,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(
			{ qryDevice }, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	DeviceActivationManagement);
