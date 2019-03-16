'use strict';

import React, { PropTypes } from 'react';
import { Row, Col, Table, Tabs, Icon } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs';
import moment from 'moment';

import 'business/style/index.less';
import {
	qryDailyDeviceActivationStatInfo,
	qryBeforeDayStatDeviceIncre,
} from 'action';
import DailyActivationSearchForm from './DeviceIncreStatSearchForm';
import * as chart from './chart';

const TabPane = Tabs.TabPane;

const chartOption = {
	scaleGridLineColor: 'rgba(0,0,0,.1)',
	responsive: true,
};
class DeviceIncreStatAdmin extends React.Component {

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		increCntStat: PropTypes.object.isRequired,
		dailyStatDeviceIncreList: PropTypes.array,
		beforeDeviceList: PropTypes.object,

	};

	static defaultProps = {
		dailyStatDeviceIncreList: [],
		beforeDeviceList: {},
	};

	constructor (props) {
		super(props);
		this.state = {
			pageSize: 10,
			currentPage: 1,
		};
	}

	componentWillMount () {
		const { actions } = this.props;
		this.handleQryDailyStat();
		actions.qryBeforeDayStatDeviceIncre();

	}

	handleQryDailyStat = (beginTime, endTime) => {
		this.props.actions.qryDailyDeviceActivationStatInfo(beginTime, endTime);
	};
	//Table行选择事件
	handleRowClk = (records) => {
		console.log('records', records);
	};

	render () {
		const { dailyStatDeviceIncreList, beforeDeviceList } = this.props;
		console.log('beforeDeviceList', beforeDeviceList);

		const DeviceIncreStatCss = ({
			RowHeight: {
				height: 20,
			},
			blueColor: {
				color: '#108ee9',
			},
		});

		if (beforeDeviceList.increCnt == undefined) {
			beforeDeviceList.increCnt = '暂无数据';
			beforeDeviceList.totalCnt = '暂无数据';
		}
		const dataSource = [
			{
				key: '1',
				newAdd: <span style={{ paddingLeft: 20 }} ><Icon type="area-chart" size="large" style={DeviceIncreStatCss.blueColor} /> 新增长数：{beforeDeviceList.increCnt} </span>,
				totailData: <span><Icon type="pie-chart" size="large" style={DeviceIncreStatCss.blueColor} /> 累计激活数：{beforeDeviceList.totalCnt} </span>,
			}];

		const columns = [
			{
				title: <div>
					<Icon type="exclamation-circle" style={DeviceIncreStatCss.blueColor} /> 昨日设备增长概况
				</div>,
				dataIndex: 'newAdd',
				key: 'newAdd',
				colSpan: 4,
			}, {
				title: '昨日设备新增长数',
				dataIndex: 'actionsData',
				key: 'actionsData',
				colSpan: 0,
			}, {
				title: '昨日设备激活数',
				dataIndex: 'address',
				key: 'address',
				colSpan: 0,
			}, {
				title: '昨日设备激活数',
				dataIndex: 'totailData',
				key: 'totailData',
				colSpan: 0,
			}];

		const columns_statistics = [
			{
				title: '租户id',
				dataIndex: 'tenantId',
				key: 'tenantId',
			}, {
				title: '统计时间',
				dataIndex: 'statDate',
				key: 'statDate',
				render: statDate => statDate &&
				moment(statDate).format('YYYY-MM-DD HH:mm:ss'),

			}, {
				title: '每日增长激活数',
				dataIndex: 'increCnt',
				key: 'increCnt',

			}, {
				title: '每日累计激活数',
				dataIndex: 'totalCnt',
				key: 'totalCnt',

			}];

		return (
			<div>
				<Tabs defaultActiveKey="1" type="card" >
					<TabPane tab={<span><Icon type="dot-chart" size="large" />`设备增长分析`</span>} key="1" >
						<Row>
							<Col>
								<Row>
									<Col span={24} style={DeviceIncreStatCss.RowHeight} >
										&nbsp;
									</Col>
								</Row>
								<Row>
									<Col span={24} >
										<DailyActivationSearchForm handleQuery={this.handleQryDailyStat} />
									</Col>
								</Row>

							</Col>
						</Row>
						<Row>
							<Col span={24} style={{ height: 30 }} >
								&nbsp;
							</Col>
						</Row>
						<Row>
							<Table
								dataSource={dataSource}
								columns={columns}
								className="tableStyle"
								pagination={false}
							/>
						</Row>

						<Row><Col style={{ height: '60px' }} >&nbsp;</Col></Row>
						<Row>
							<Col span={23}>
								<div>
									<Line
										height="200px"
										style={{
											width: '100%',
											height: '200px',
										}}
										data={this.props.increCntStat}
										options={chartOption}
									/>
								</div>
							</Col>
						</Row>
						<Row>
							<Col style={{ height: 40 }} >&nbsp;</Col>
						</Row>
						<Row>
							<Col>
								<Table
									dataSource={dailyStatDeviceIncreList}
									onRowClick={this.handleRowClk}
									columns={columns_statistics}
								/>
							</Col>
						</Row>
					</TabPane>
				</Tabs>
			</div>
		);
	}
}
const mapStateToProps = (state) => {

	const { dailyStatDeviceIncreList, totalCount, currentPage, beginTime, endTime, beforeDeviceList } = state.get(
		'DeviceIncreStat').toObject();
	const { increCntStat, totalCntStat } = chart.createStatDeviceIncreChat(beginTime,
		endTime, dailyStatDeviceIncreList);
	console.log('increCntStat', increCntStat);
	console.log('totalCntStat', totalCntStat);
	return {
		dailyStatDeviceIncreList,
		totalCount,
		currentPage,
		increCntStat,
		totalCntStat,
		beforeDeviceList,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(
			{
				qryDailyDeviceActivationStatInfo,
				qryBeforeDayStatDeviceIncre,
			}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	DeviceIncreStatAdmin);
