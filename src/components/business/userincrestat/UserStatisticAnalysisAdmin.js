'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Table, Tabs, Icon, Button, Radio } from 'antd';
import { Line, Pie } from 'react-chartjs';
import { parseDateTime } from 'utils/DateUtil';

import { usersPieData, getBeforeDayUserIncre, qryHardwareByForm,qryUserIncreByTime  } from 'action';
import moment from 'moment';
import UserincrestatSearchForm from './UserincrestatSearchForm';
import { UseStatisticChartData } from  '../chartjs';

const TabPane = Tabs.TabPane;

const chartOption = {
	responsive: true//调整大小时，其容器还是图表画布 布尔值
};


const createStatDeviceIncreChat = ( beginTime, endTime, UseGrowpStaticAnalysis) => {
	const labels = [];
	const increCntList = [];
	const netIncreCntList = [];
	const unbindCntList = [];
	const totalCntList = [];

	const beginDayMoment = moment(beginTime);
	const endDayMoment = moment(endTime);

	for (let dayMoment = beginDayMoment; dayMoment.dayOfYear() <=
	endDayMoment.dayOfYear(); dayMoment.add(1, 'days')) {
		const beginDayStr = dayMoment.format('YYYYMMDD');
		let isFind = false;
		let increCnt = 0;
		let netIncreCnt = 0;
		let unbindCnt = 0;
		let totalCnt = 0;
		if (UseGrowpStaticAnalysis) {
			for (const index in UseGrowpStaticAnalysis) {
				const record = UseGrowpStaticAnalysis[index];
				if (moment(record.statDate).format('YYYYMMDD') === beginDayStr) {
					isFind = true;
					increCnt = record.increCnt;
					netIncreCnt = record.netIncreCnt;
					unbindCnt = record.unbindCnt;
					totalCnt = record.totalCnt;
					break;
				}
			}

		}
		labels.push(beginDayStr);
		increCntList.push(increCnt);
		netIncreCntList.push(netIncreCnt);
		unbindCntList.push(unbindCnt);
		totalCntList.push(totalCnt);
	}

	return {
	 	netIncreCntStat: {
	 		labels,
			 datasets: [
			 {
				 fill: true,
				 lineTension: 0.1,
				 pointRadius: 1,
				 pointHitRadius: 10,
				 spanGaps: false,
				 fillColor: 'rgba(151,187,205,0.2)',
				 strokeColor: 'rgba(151,187,205,1)',
				 pointColor: 'rgba(151,187,205,1)',
				 data: netIncreCntList,
			 }],
	 	},
		increCntStat: {
			labels,
			datasets: [
				{
					fill: true,
					lineTension: 0.1,
					pointRadius: 1,
					pointHitRadius: 10,
					spanGaps: false,
					fillColor: 'rgba(151,187,205,0.2)',
					strokeColor: 'rgba(151,187,205,1)',
					pointColor: 'rgba(151,187,205,1)',
					data: increCntList,
				}],
		},
		unbindCntStat: {
			labels,
			datasets: [
				{
					fill: true,
					lineTension: 0.1,
					pointRadius: 1,
					pointHitRadius: 10,
					spanGaps: false,
					fillColor: 'rgba(151,187,205,0.2)',
					strokeColor: 'rgba(151,187,205,1)',
					pointColor: 'rgba(151,187,205,1)',
					data: unbindCntList,
				}],
		},
		totalCntStat: {
			labels,
			datasets: [
				{
					fill: true,
					lineTension: 0.1,
					pointRadius: 1,
					pointHitRadius: 10,
					spanGaps: false,
					fillColor: 'rgba(0, 0, 0, 0)',
					strokeColor: 'rgba(151,187,205,1)',
					pointColor: 'rgba(151,187,205,1)',
					data: totalCntList,
				}],
		},

	};
};

class UserStatisticAnalysisAdmin extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired,
		store: PropTypes.object.isRequired,
	};

	static propTypes = {
		UseGrowpStaticAnalysis: PropTypes.array,
		usersPieData: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		addNewPieData: PropTypes.object.isRequired,
		statDeviceIncreChat: PropTypes.object,
		beforeDayRcord: PropTypes.array,
	};

	static defaultProps = {
		UseGrowpStaticAnalysis: [],
		beforeDayRcord: [],
		statDeviceIncreChat: {}
	};

	constructor (props, context) {
		super(props, context);
		this.state = {
			tabPage: '用户统计',
			tabKey: 0,
			selectedRowKeys: [],
			currentPage: 1,       //当前选中的分页
			tabValue: 'increCnt',
		};
	}
	componentWillMount () {
		const { actions } = this.props;
		this.handleQuery();
		//昨日用户增长统计
		actions.getBeforeDayUserIncre();
	}
	handleSizeChange = (e) => {
		this.setState({ tabValue: e.target.value }, () => {
			this.handleQuery();
		} );

	};

	//[查询] 按钮
	handleQuery = (qryForm) => {
		const { actions } = this.props;
		// const { tabvalue } = this.state;
		if (!qryForm) {
			qryForm = {};
			qryForm.endTime = moment(moment(new Date()).subtract(1, 'days').format('YYYYMMDD')).toDate().getTime();
			qryForm.beginTime = moment(qryForm.endTime).subtract(7, 'days').toDate().getTime();
		}
		//用户增长统计
		actions.qryUserIncreByTime(qryForm);

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
		const { addNewPieData,beforeDayRcord } = this.props;
		const { UseGrowpStaticAnalysis } = this.props;
		const { tabValue } = this.state;
		const { usersPieData } = this.props;
		let addUsersPieData = [];
		if (usersPieData) {
			addUsersPieData = [...usersPieData];
		}

		const columns = [
			{
				title: '统计时间',
				dataIndex: 'statDate',
				key: 'statDate',
				width: '250px',
				render: statDate => statDate && moment(statDate).format('YYYY-MM-DD HH:mm:ss'),
			}, {
				title: '新增数',
				dataIndex: 'increCnt',
				key: 'increCnt',
			},{
				title: '解绑数',
				dataIndex: 'unbindCnt',
				key: 'unbindCnt',
			}, {
				title: '净增数',
				dataIndex: 'netIncreCnt',
				key: 'netIncreCnt',

			}, {
				title: '累计数',
				dataIndex: 'totalCnt',
				key: 'totalCnt',
			}];


		const { statDeviceIncreChat } = this.props;
		const lineChart = () => {
			if (tabValue ==='increCnt'){
				return statDeviceIncreChat.increCntStat;
		 	} else if (tabValue ==='unbindCnt'){
				return statDeviceIncreChat.unbindCntStat;
			} else if (tabValue ==='netIncreCnt'){
				return statDeviceIncreChat.netIncreCntStat;
			} else if (tabValue ==='totalCnt'){
				return statDeviceIncreChat.totalCntStat;
			} else if (tabValue ===''){
				return statDeviceIncreChat.increCntStat;
			}
		};

		const DevicestatisticsCss = ({
			RowHeight: {
				height: 20
			},
			blueColor: {
				color: '#108ee9'
			}
		});

		const statsticCss=({
			deviceStyle: {
				padding: '0px'
			},
			titleBar: {
				height: '35px',
				color: '#666',
				margin: '15px 0px 20px 0px',
				lineHeight: '45px',
				padding: '0 15px 0 0px',
				fontSize: '15px',
				borderTopRightRadius: '5px',
				webkitBorderTopLeftRadius: '5px',
			},

		});

		const str='暂无数据';
		if (!beforeDayRcord) {
			beforeDayRcord['increCnt']=str;
			beforeDayRcord['unbindCnt']=str;
			beforeDayRcord['netIncreCnt']=str;
			beforeDayRcord['totalCnt']=str;
		}
		const searchCSS=({
			display: 'flex',
		});
		const beforeDataSocure = [{
			key: '1',
			increCnt: <span style={{ paddingLeft: 20 }}><Icon type="area-chart" size="large"  style={DevicestatisticsCss.blueColor}  /> 新增数：{beforeDayRcord.increCnt} </span>,
			unbindCnt: <span><Icon type="bar-chart" size="large"  style={DevicestatisticsCss.blueColor}  /> 解绑数：{beforeDayRcord.unbindCnt} </span>,
			netIncreCnt: <span><Icon type="pie-chart" size="large"  style={DevicestatisticsCss.blueColor}  /> 净增数：{beforeDayRcord.netIncreCnt} </span>,
			totalCnt: <span><Icon type="line-chart" size="large"  style={DevicestatisticsCss.blueColor}  /> 累计数：{beforeDayRcord.totalCnt} </span>,
		}];

		const beforeDaycolumns = [
			{
				title: <div><Icon type="exclamation-circle"  style={DevicestatisticsCss.blueColor} /> 昨日用户增长统计</div>,
				dataIndex: 'increCnt',
				key: 'increCnt',
				colSpan: 4,
			},{
				title: '解绑数',
				dataIndex: 'unbindCnt',
				key: 'unbindCnt',
				colSpan: 0,
			},{
				title: '净增数',
				dataIndex: 'netIncreCnt',
				key: 'netIncreCnt',
				colSpan: 0,
			},{
				title: '累计数',
				dataIndex: 'totalCnt',
				key: 'totalCnt',
				colSpan: 0,
			},];

		return (
			<div>
				<Tabs defaultActiveKey="1"  type="card">
					<TabPane tab={<span><Icon type="usergroup-add" size="large" />用户增长</span>} key="1" ><Row>
						<Row><Col style={{ height: '20px' }}>&nbsp;</Col></Row>
						<Row>
							<Table
								dataSource={beforeDataSocure}
								columns={beforeDaycolumns}
								className="tableStyle"
								pagination={false}
							/>
						</Row>
						<Row><Col style={{ height: '20px' }}>&nbsp;</Col></Row>
						<Col style={statsticCss.titleBar}>
							<Radio.Group onChange={this.handleSizeChange}>
								<Radio.Button value="increCnt" size="large" > <Icon type="user-add" size="large" /> 新增用户数</Radio.Button>
								<Radio.Button value="unbindCnt" size="large"> <Icon type="user-delete" size="large" /> 解绑用户数</Radio.Button>
								<Radio.Button value="netIncreCnt" size="large"> <Icon type="user" size="large" /> 净增用户数</Radio.Button>
								<Radio.Button value="totalCnt" size="large"> <Icon type="usergroup-add" size="large" /> 累计用户数</Radio.Button>
							</Radio.Group>
						</Col>
					</Row>
						<Row><Col><UserincrestatSearchForm  handleQuery={this.handleQuery} /></Col></Row>

						<Row><Col style={{ height: '30px' }}>&nbsp;</Col></Row>
						<Row>
							<Col span={23}>
								<div><Line data={lineChart()} options={chartOption} style={{ height: '350px', width: '100%' }} /></div>
								{/*<p className="destion"> &nbsp;&nbsp;&nbsp;<b className="bluerec">&nbsp;</b> 新增数 <b className="yrec">&nbsp;</b> 解绑数  <b className="sbluerec">&nbsp;</b> 净增数 <b className="z_red">&nbsp;</b> 累计数</p>*/}
							</Col>
						</Row>
						<Row>
							<Col style={{ height: 40 }}>&nbsp;</Col>
						</Row>
						<Row>
							<Col>
								<Table
									columns={columns}
									rowKey={record => UseGrowpStaticAnalysis.appType}
									dataSource={UseGrowpStaticAnalysis}
									onRowClick={this.handleRowClk}
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

	const { rspInfo } = state.get('RootService').toObject();
	const { UseGrowpStaticAnalysis, usersPieData,addNewPieData,beforeDayRcord,beginTime,endTime } = state.get('userIncreStatReducer').toObject();
	return {
		UseGrowpStaticAnalysis,
		usersPieData,
		addNewPieData,
		beforeDayRcord,
		beginTime,
		endTime,
		statDeviceIncreChat: createStatDeviceIncreChat(beginTime, endTime, UseGrowpStaticAnalysis)
	};
};



const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(
			{ qryUserIncreByTime, usersPieData, getBeforeDayUserIncre }, dispatch),
	};
};


export default connect(mapStateToProps, mapDispatchToProps)(UserStatisticAnalysisAdmin);