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

const TabPane = Tabs.TabPane;
class StatisticIndex extends React.Component {
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
		actions.sysMsg();
		actions.newUsers();
		actions.usersChart();
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

	render () {
		const { sysMsg, newUsersList, usersChartLastDay, usersPieData, addNewPieData } = this.props;
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

		let sysInfor = '';
		if (sysMsg !== undefined) {
			sysInfor = sysMsg.map((item, index) => {
				return (
					<p className="msgtit" key={`LayOut_${item.key}`} >
						<Link to={URL} key={`sub_${item.key}`} >{`${item.key}、${item.title}`}</Link>
					</p>
				);
			});
		}
		let addUsersPie = '';
		if (addNewPieData) {
			addUsersPie = addNewPieData.map((item, index) =>
				<div key={`addUsersPie${index}`} style={{ height: 30 }} >
					<Col span="8" offset={2} >{item.menus}</Col>
					<Col span="8" >{item.usersNum}</Col>
					<Col span="6" >{item.pre}</Col>
				</div>,
			);
		}

		let lineData = '';
		let lineCharts = '';
		if (usersChartLastDay) {
			//曲线数据
			lineData = {
				labels: usersChartLastDay.labels,
				datasets: usersChartLastDay.usersChart,
			};

			lineCharts = (
				<Line data={lineData} options={chartOption} />
			);
		}
		const columns = [
			{
				title: 'account',
				dataIndex: 'account',
				width: 70,
			}, {
				title: 'usesname',
				dataIndex: 'usesname',
			}, {
				title: 'state',
				dataIndex: 'state',
			}];
		const statsticCss=({
			deviceStyle: {
				padding: '0px'
			}

		});

		console.log('statsticCss.deviceStyle',statsticCss.deviceStyle);


		return (
			<div>
				<Row>
					<Col span={5} >
						<header className="lastUsers" >最新用户</header>
						<Col className="LeftSide" >
							<Row>&nbsp;</Row>
							<Row style={{ textAlign: 'center' }} >
								<Col span={8} >
									<Icon type="solution" className="iconStyle" />
								</Col>
								<Col span={8} >
									<Icon type="user" className="iconStyle" />
								</Col>
								<Col span={8} >
									<Icon type="clock-circle-o" className="iconStyle" />
								</Col>
							</Row>

							<Row style={{ fontSize: 14, textAlign: 'center' }} >
								<Col span={8} >账号</Col>
								<Col span={8} >姓名</Col>
								<Col span={8} >状态</Col>
							</Row>
							<Row>&nbsp;</Row>
							<Row>
								<Table
									columns={columns}
									showHeader={false}
									pagination={false}
									className="userName"
									dataSource={newUsersList}
									onChange={this.onChangeTable}
								/>
							</Row>
						</Col>
					</Col>

					<Col span={13} className="middleTop" style={{ paddingLeft: '15px' }} >
						<Row className="middleHeder" >
							<Icon
								type="pie-chart" size="large"
								style={{
									fontSize: 22,
									color: '#fff',
								}}
							/>&nbsp;今日统计分析
						</Row>
						<Row>
							<Tabs defaultActiveKey="1" onChange={this.onCangeTabCallback} >

								<TabPane tab="用户统计" key="1" >
									<Row style={{ paddingTop: 20 }} >
										<Col span="12" className="txtShow" >
											{addUsersPie}
											<div className="leareMore" >
												<Link to={`${businessRoute.statistic}${this.state.tabPage}`} key={9} >
													<span>查看更多...</span>
												</Link>
											</div>
										</Col>
										<Col span="12" >
											<Pie data={addUsersPieData} options={chartOption} />
											<h3 className="home-title-x" >吻吻密语</h3>
										</Col>
									</Row>
								</TabPane>
								<TabPane tab="用户留存率" key="2" >
									<Row>
										<Col span={12} style={{ lineHeight: '25px' }} >
											<p style={{ marginBottom: '15px' }} >
												<strong>用户留存率:</strong>
											</p>
											统计用户1日、2日、3日、4日、5日、6日、7日、30日留存率，开始、结束时间必填，时间间隔不能超过3个月，起始时间不能低于2016-10-01
											<p
												style={{
													marginTop: '10px',
													textAlign: 'right',
												}}
											>
												<Link to={businessRoute.statUserRetain} key={11} >
													<span>查看更多</span>
												</Link> &nbsp; &nbsp;
											</p>
										</Col>
										<Col span={12} >
											<Link to={businessRoute.statUserRetain} key={12} >
												<img
													src={require(
														'framework/views/images/statUserRetain.jpg')}
													width="250"
												/>
											</Link>
										</Col>
									</Row>

								</TabPane>
								<TabPane tab="模块统计" key="3" >模块统计</TabPane>
								<TabPane tab="App类型配置统计" key="4" >App类型配置统计</TabPane>
								<TabPane tab="产品统计" key="5" >产品统计</TabPane>
								<TabPane tab="发现统计" key="6" >发现统计</TabPane>
							</Tabs>
						</Row>
						<Row>
							<header className="lastUsesChart" >
								<Icon
									type="area-chart"
									style={{
										fontSize: 21,
										color: '#2db7f5',
									}}
								/>近30日新用户走势图
							</header>
							{lineCharts}
						</Row>
					</Col>

					<Col span={5} style={{ paddingLeft: '10px' }} >
						<header className="lastUsers" >
							<Icon
								type="clock-circle-o" size="large"
								style={{
									fontSize: 21,
									color: '#fff',
								}}
							/> {`${Year}年${Month}月${Day}日`}
						</header>
						<Row>
							&nbsp;
						</Row>
						<Row >
							<PanelBox title="硬件统计" key="3" style={statsticCss.deviceStyle} >
								<Link to={businessRoute.HardwareStatistic} key="3" >
									<img
										src={require(
											'framework/views/images/timg.png')}
										alt="硬件统计"
										width="100%"
									/>
								</Link>
							</PanelBox>

						</Row>

						<PanelBox title="APP终端设备" key="0" >
							<Link to={URL} key="0" >
								<img
									src={require(
										'framework/views/images/zdsb.png')}
									alt="终端设备"
									width="100%"
								/>
							</Link>
						</PanelBox>

						<PanelBox title="APP消息管理" key="1" >
							{sysInfor}
							<p style={{ textAlign: 'right', marginTop: 15 }} >
								<Link to={URL} key="1" ><span>更多消息</span></Link>
							</p>
						</PanelBox>
						<PanelBox title="APP错误统计" key="2" >
							<Link to={URL} key="2" >
								<img
									src={
										require(
											'framework/views/images/u165.png')
									}
									alt="终端设备" width="100%"
								/>
							</Link>
						</PanelBox>
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

export default connect(mapStateToProps, mapDispatchToProps)(StatisticIndex);
