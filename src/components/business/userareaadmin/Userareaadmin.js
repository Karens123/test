'use strict';


import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Table, Tabs, Icon } from 'antd';
import { Line, Pie } from 'react-chartjs';


import * as actions from 'action';
import * as MsgUtil from 'utils/MsgUtil';
import * as HttpUtil from 'utils/HttpUtil';
import * as businessRoute from 'business/route';
import PanelBox from 'framework/components/PanelBox';
import UserareaadminForm from './UserareaadminForm';

const TabPane = Tabs.TabPane;
class Userareaadmin extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		usersChartLastDay: PropTypes.object.isRequired,
		usersPieData: PropTypes.object.isRequired,
		addNewPieData: PropTypes.object.isRequired,
		sysMsg: PropTypes.object.isRequired,
		newUsersList: PropTypes.array.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		refreshData: PropTypes.object.isRequired,
	};

	constructor (props, context) {
		super(props, context);
		this.state = {
			tabPage: '用户统计',
			tabKey: 0,
		};
	}

	//只是第一次render之后被调用
	componentDidMount () {
		const { actions, rspInfo, refreshData } = this.props;
		// actions.sysMsg();
		// actions.newUsers();
		// actions.usersChart();
		actions.usersPieData();
		// actions.getAllAppTypeInfoList();
	}

	//每次更新时被调用
	componentDidUpdate () {
		const { rspInfo } = this.props;
		if (rspInfo && rspInfo.resultCode != 0) {
			MsgUtil.showwarning(
				`查询失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
		}
	}

	onChangeTable = (pagination, filters, sorter) => {
		console.log('params', pagination, filters, sorter);
	};
	onCangeTabCallback = (key) => {

		let tabStr = { tabName: '' };
		switch (key) {
			case '1': {
				tabStr = { tabName: '用户统计' };
				break;
			}
			case '2': {
				tabStr = { tabName: '模块统计' };
				break;
			}
			case '3': {
				tabStr = { tabName: 'App类型配置统计' };
				break;
			}
			case '4': {
				tabStr = { tabName: '产品统计' };
				break;
			}
			case '5': {
				tabStr = { tabName: '发现统计' };
				break;
			}
				break;
			default:
		}
		this.setState({
			tabPage: tabStr.tabName,
			tabKey: key.charAt(4),
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
				component.setState({ currentPage: 1 });
			},
			onChange(current) {
				component.setState({ currentPage: current });
			},
		};
	};

	//[查询] 按钮
	handleQuery = (qryForm) => {
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
				tabValue: this.state.tabValue,
				beginTime: last7DayTime,
				endTime: currentDateTime,
			};
		}
		console.log('qryForm', qryForm);
		actions.qryHardwareByForm(qryForm);
	};


	render () {
		const { sysMsg, newUsersList, usersChartLastDay, usersPieData, addNewPieData } = this.props;
		console.log('usersPieData', usersPieData);
		const { selectedRowKeys, currentPage, tabPage } = this.state;
		const chartOption = {
			responsive: true//调整大小时，其容器还是图表画布 布尔值
		};

		const URL = HttpUtil.statisticUrl();
		const myDate = new Date();
		const Year = myDate.getFullYear();
		const Month = myDate.getMonth() + 1;
		const Day = myDate.getDate();

		let msgInfor = {};

		for (const variable in sysMsg) {
			if (variable === 0) {
				msgInfor = [...sysMsg[0]];
			}
		}

		let addUsersPieData = [];
		if (usersPieData) {
			addUsersPieData = [...usersPieData];
		}


		console.log('addUsersPieData', addUsersPieData);

		const columns = [
			{
				title: '国家',
				dataIndex: 'statDate',
				key: 'statDate',
				render: (text,records) => {
					return (`${records.statDate.substring(0,4)}-${records.statDate.substring(4,6)}-${records.statDate.substring(6,8)}`);
				}
			}, {
				title: '用户数',
				dataIndex: 'cotTotail',
				key: 'cotTotail',
				render: (text,records) => {
					return (records.failCnt + records.successCnt);
				},
			},{
				title: '详细地区',
				dataIndex: 'successCnt',
				key: 'successCnt',
			}, {
				title: '备注',
				dataIndex: 'Percentage',
				key: 'Percentage',
				render: (text,records) => {
					const totail = records.failCnt + records.successCnt;
					return (
						`${Math.round((records.successCnt/totail)*100)}%`
					);
				},
			},{
				title: '占比',
				dataIndex: 'Proportion',
				key: 'Proportion',
			},];



		return (
			<div>
				<Row><Col><UserareaadminForm  handleQuery={this.handleQuery} /></Col></Row>
				<Row><Col><Pie data={addUsersPieData} options={chartOption} style={{ height: '250px', width: '100%' }} /></Col></Row>
				<Row>
					<Col style={{ height: 45 }}>
						 &nbsp;
					</Col>
				</Row>
				<Row>
					<Col>
						<Table
							columns={columns}
							rowKey={record => records.appType}
							dataSource={usersPieData}
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
	const { sysMsg, newUsersList, usersChartLastDay, usersPieData, addNewPieData, refreshData }
		= state.get('appStatistic').toObject();
	return {
		rspInfo,
		refreshData,
		sysMsg,
		newUsersList,
		usersChartLastDay,
		usersPieData,
		addNewPieData,

	};
};

const mapDispatchToProps = (dispatch) => {
	const { sysMsg, newUsers, usersChart, usersPieData } = actions;
	return {
		actions: bindActionCreators(
			{ sysMsg, newUsers, usersChart, usersPieData }, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Userareaadmin);
