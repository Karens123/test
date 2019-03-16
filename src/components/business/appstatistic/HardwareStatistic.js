'use strict';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Table, Tabs, Icon } from 'antd';
import { Line, Pie } from 'react-chartjs';
import * as businessRoute from 'business/route';

import * as actions from 'action';
import moment from 'moment';
import HardwareStatisticSearchForm from './HardwareStatisticSearchForm';
import { HardwareStatisticChartData } from  '../chartjs';

const chartOption = {
	responsive: true//调整大小时，其容器还是图表画布 布尔值
};

class HardwareStatistic extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		records: PropTypes.array,
		actions: PropTypes.object.isRequired,
	};

	static defaultProps = {
		records: [],
	};

	constructor (props, context) {
		super(props, context);
		this.state = {
			selectedRowKeys: [],
			currentPage: 1,       //当前选中的分页
		};
	}
	componentWillMount () {
		const { actions } = this.props;
		this.handleQuery();
	}

	//[查询] 按钮
	handleQuery = (qryForm) => {
		console.log('qryForm', qryForm);
		const { actions } = this.props;
		if (!qryForm) {
			const currentDate = new Date();
			const currentDateTime = moment(
				`${moment(currentDate).format('YYYYMMDD')}235959`,
				'YYYYMMDDhhmmss').toDate().getTime();
			const last7DayTime = moment(
				moment(currentDate).subtract(7, 'days').format('YYYYMMDD'),
				'YYYYMMDDhhmmss').toDate().getTime();
			qryForm = {
				beginTime: last7DayTime,
				endTime: currentDateTime,
			};
		}
 	actions.qryHardwareByForm(qryForm);
	};

	//Table行选择事件
	handleRowClk = (selectedRowKeys) => {
		this.setState({ selectedRowKeys });
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
		const { records } = this.props;
		let sumToatil=0;
		records.forEach( (item) => {
			sumToatil = item.failCnt + item.successCnt;
		});

		const hardwareStatisticDate = [];
		const hardwareSucessData = [];
		const hardwareFailData = [];
		if (records) {
			records.forEach(( item, index ) => {
				hardwareStatisticDate.push(item.statDate);
				hardwareSucessData.push(item.successCnt);
				hardwareFailData.push(item.failCnt);
			});
		}

		const columns = [
			{
				title: '日期',
				dataIndex: 'statDate',
				key: 'statDate',
				render: (text,records) => {
					return (`${records.statDate.substring(0,4)}-${records.statDate.substring(4,6)}-${records.statDate.substring(6,8)}`);
				}
 			}, {
				title: '连接总数',
				dataIndex: 'cotTotail',
				key: 'cotTotail',
				render: (text,records) => {
					return (records.failCnt + records.successCnt);
				},
 			},{
				title: '连接成功次数',
				dataIndex: 'successCnt',
				key: 'successCnt',
 			}, {
				title: '连接失败次数',
				dataIndex: 'failCnt',
				key: 'failCnt',

			}, {
				title: '发送成功率',
				dataIndex: 'Percentage',
				key: 'Percentage',
				render: (text,records) => {
					const totail = records.failCnt + records.successCnt;
					return (
						`${Math.round((records.successCnt/totail)*100)}%`
					);
				},
			}];

		const lineData = {
			labels: hardwareStatisticDate,
			height: 230,
			datasets: HardwareStatisticChartData( hardwareFailData, hardwareSucessData, hardwareStatisticDate ).HardwareStatisticChart
		};

		const HardwareFlag =(lineData) => {
			let DataItem=[];
			for ( const item in lineData) {
				if ( item ==='datasets') {
					DataItem= lineData[item][0].data;
				}
			}
			if ( DataItem.join('') === '') {
				return (
					<p className="destion">暂无数据</p>
				);
			} else {
				return (
					<p className="destion"><b className="yrec">&nbsp;</b> 成功 &nbsp;&nbsp;&nbsp;<b className="bluerec">&nbsp;</b> 失败</p>
				);
			}
		};



		const statsticCss=({
			deviceStyle: {
				padding: '0px'
			},
			titleBar: {
				height: '45px',
				backgroundColor: '#ecf6fd',
				color: '#666',
				margin: '0px 0px 20px',
				lineHeight: '45px',
				padding: '0 15px',
				fontSize: '15px',
				borderTopRightRadius: '5px',
				webkitBorderTopLeftRadius: '5px',
				border: '1px solid #d2eafb'
			},
		});

		return (
			<div>
				<Row>
					<Col style={statsticCss.titleBar}>
						<Icon type="link" /> 设备连接概览 &nbsp;/&nbsp; <Link to={businessRoute.HardwareConnectStatisticDetail} key="linkDeatil">
							<Icon type="bar-chart" /> <b>设备连接明细</b></Link>
					</Col>
				</Row>
				<Row><Col><HardwareStatisticSearchForm  handleQuery={this.handleQuery} /></Col></Row>

				<Row><Col style={{ height: '20px' }}>&nbsp;</Col></Row>
				<Row>
					<Col>
						<div>
							<div><Line data={lineData} options={chartOption} style={{ height: '350px', width: '100%' }} /></div>
							{ HardwareFlag(lineData) }
						</div>
					</Col>
				</Row>
				<Row>
					<Col style={{ height: 40 }}>&nbsp;</Col>
				</Row>
				<Row>
					<Col>
						<Table
							columns={columns}
							rowKey={record => records.appType}
							dataSource={records}
							onRowClick={this.handleRowClk}
						/>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo } = state.get('RootService').toObject();
	const { records } = state.get('appStatistic').toObject();
	return {
		records,
	};
};

const mapDispatchToProps = (dispatch) => {
	const { qryHardwareByForm } = actions;
	return {
		actions: bindActionCreators(
			{ qryHardwareByForm }, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(HardwareStatistic);