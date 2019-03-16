'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Button, Icon, DatePicker, Popover, Select } from 'antd';
import { Line } from 'react-chartjs';
import * as actions from 'action';
import * as MsgUtil from 'utils/MsgUtil';
import PanelBox from 'framework/components/PanelBox';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as chartjs from '../chartjs';

const Option = Select.Option;
moment.locale('zh-cn');
const { RangePicker } = DatePicker;
const showDateFormat = 'YYYY-MM-DD';
const currentDate = new Date();
//moment：合并一个对象
const currentDateMoment = moment(currentDate).format(showDateFormat);
const last7DayMoment = moment(currentDate).
	subtract(7, 'days').
	format(showDateFormat);
const last30DayMoment = moment(currentDate).
	subtract(30, 'days').
	format(showDateFormat);

class UserStatistic extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		newUserList: PropTypes.array,
		sysMsg: PropTypes.object,
		useWholeStatistic: PropTypes.array,
		activeUserList: PropTypes.array,
		actions: PropTypes.object.isRequired,
		rspInfo: PropTypes.object,
	};

	static defaultProps = {
		newUserList: [],
		useWholeStatistic: [],
		sysMsg: undefined,
		rspInfo: undefined,
		activeUserList: [],
	};

	constructor (props, context) {
		super(props, context);
		this.state = {
			userType: '',//用户类型
			startDateMoment: last7DayMoment,
			endDateMoment: currentDateMoment,
			beginTime: '',
			endTime: '',
			SelectUserType: ''//select用户类型
		};
	}

	//只是第一次render之后被调用
	componentDidMount () {
		const { actions } = this.props;
		actions.userWholeStatistic();
		actions.addNewUser();
		actions.statActiveUser();
		this.last7DayStat();
	}

	//每次更新时被调用
	componentDidUpdate () {
		const { rspInfo } = this.props;
		if (rspInfo && rspInfo.resultCode != 0) {
			MsgUtil.showwarning(
				`查询失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
		}
	}

	handleChange = (value) => {
		this.state.SelectUserType = value;
	};

	//每日设备激活统计列表查询
	qryRangePickerChange = (startDateMoment, endDateMoment) => {
		if (!startDateMoment && !endDateMoment) {
			startDateMoment = last7DayMoment;
			endDateMoment = currentDateMoment;
		}
		this.setState({ startDateMoment, endDateMoment, });
	};

	//按时间段查询
	rangePickerChange = (value, dateString) => {
		//调用自定义qryRangePickerChange方法
		this.qryRangePickerChange(dateString[0], dateString[1]);
		this.setState({
			beginTime: `${MsgUtil.timeFormat(dateString[0])}000000`,
			endTime: `${MsgUtil.timeFormat(dateString[1])}000000`,
		});
	};

	qryAddNewUser = (e) => {
		e.preventDefault;
		this.setState({
			userType: '',
		});
		this.props.actions.addNewUser();
	};

	qryActiverUsers = (e) => {
		e.preventDefault;
		this.setState({
			userType: 'activerUsers',
		});
		this.props.actions.statActiveUser();
	};

	qryStartUsers = (e) => {
		e.preventDefault;
		this.setState({
			userType: 'StartUsers',
		});
	};

	handleQuery = () => {
		const { actions } = this.props;
		const { beginTime, endTime } = this.state;
		let { SelectUserType } = this.state;
		let qryDate = { beginTime, endTime };

		//没选change时间,默认为最近7天
		if (beginTime == '' || endTime == '') {
			qryDate = {
				beginTime: `${MsgUtil.timeFormat(last7DayMoment)}000000`,
				endTime: `${MsgUtil.timeFormat(currentDateMoment)}000000`,
			};
		}

		//没select选择用户类型,默认0为新增用户
		if (SelectUserType == '') {
			SelectUserType = 0;
		}

		switch (SelectUserType) {
			case 0: {
				actions.addNewUser(qryDate);
				break;
			}
			case 1: {
				actions.statActiveUser(qryDate);
				break;
			}
			case 2: {
				break;
			}
				break;
			default:
				return false;
		}
	};

	//过去7天统计查询
	last7DayStat = () => {
		const { SelectUserType } = this.state;
		const qryDate = {
			beginTime: `${MsgUtil.timeFormat(last7DayMoment)}000000`,
			endTime: `${MsgUtil.timeFormat(currentDateMoment)}000000`,
		};

		switch (SelectUserType) {
			case 0: {
				actions.addNewUser(qryDate.beginTime, qryDate.endTime);
				break;
			}
			case 1: {
				actions.statActiveUser(qryDate.beginTime, qryDate.endTime);
				break;
			}
			case 2: {
				actions.statUser(qryDate.beginTime, qryDate.endTime);
				break;
			}
				break;
			default:
				return false;
		}
	};
	//过去30天统计查询
	last30DayStat = () => {
		const { SelectUserType } = this.state;
		const qryDate = {
			beginTime: `${MsgUtil.timeFormat(last30DayMoment)}000000`,
			endTime: `${MsgUtil.timeFormat(currentDateMoment)}000000`,
		};

		switch (SelectUserType) {
			case 0: {
				actions.addNewUser(qryDate.beginTime, qryDate.endTime);
				break;
			}
			case 1: {
				actions.statActiveUser(qryDate.beginTime, qryDate.endTime);
				break;
			}
			case 2: {
				actions.statUser(qryDate.beginTime, qryDate.endTime);
				break;
			}
				break;
			default:
				return false;
		}

	};

	render () {
		const { sysMsg, useWholeStatistic, activeUserList } = this.props;
		let { newUserList } = this.props;
		const { userType } = this.state;
		const chartOption = {
			responsive: true,
		};
		const myDate = new Date();
		const Year = myDate.getFullYear();
		const Month = myDate.getMonth() + 1;
		const Day = myDate.getDate();

		let newAddUsers = [];
		for (const variable in useWholeStatistic) {
			newAddUsers = Array.of(
				useWholeStatistic[variable].addUsers,
				useWholeStatistic[variable].activerUsers,
				useWholeStatistic[variable].startUsers,
				useWholeStatistic[variable].totalUsers);
		}

		const useWhioleData = newAddUsers.map((item, index) => {
			return (
				<Col
					span={5}
					className={`box_${index + 1} box`}
					key={`ColKey_${index}`}
				>
					<h3>{item.name}</h3>
					<p>{item.data}</p>
				</Col>
			);
		});

		const content = (
			<div>
				<p> 新增用户：325人</p>
				<p> 活跃用户：5250人</p>
				<p>启动次数：52500次数</p>
				<p> 累计用户：1937739</p>
			</div>
		);

		const lastUseStatisic = (
			<div>
				统计新增用户数，开始、结束时间必填，时间间隔不能超过3个月，起始时间不能低于2016-10-01
			</div>
		);

		if (this.props.newUserList || activeUserList) {
			//新增用户
			if (Object.is(userType, '')) {
				newUserList = [...this.props.newUserList];
				//活动用户(默认userType为空)
			} else if (Object.is(userType, 'activerUsers')) {
				newUserList = [...activeUserList];
				//启动用户
			} else if (Object.is(userType, 'StartUsers')) {
				newUserList = [...this.props.newUserList];
			}
		}

		const item = [];//数据
		const item2 = [];//月份
		if (newUserList) {
			for (const variable of newUserList) {
				item.push(variable.newCnt);
				item2.push(MsgUtil.myGetMonth(variable.statDate));
			}
		}
		let lineChatPorpsType = {};

		chartjs.linechartPropType.forEach(
			item => lineChatPorpsType = item.addUsersPropTypeValue);

		const lineChartObj = {
			labels: item2,
			datasets: [
				{
					data: [...item],
					...lineChatPorpsType
				},
			],
		};

		return (
			<div>
				<PanelBox
					title={
						<span>
							<b>关键实时指标 </b>
							<i >
							&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
								<RangePicker   />
							</i>
						</span>
					}
					key="关键实时指标"
				>
					<Col>&nbsp;</Col> <Col>&nbsp;</Col> <Col>&nbsp;</Col>
					{useWhioleData}
				</PanelBox>

				<div>
					<header className="titleBar" >
						<Row>
							<Col span={17} >
								新增用户  &nbsp;&nbsp;
								<Popover content={lastUseStatisic} title="新增用户" placement="rightTop" >
									<Icon type="question-circle-o" style={{ color: '#2db7f5' }} />
								</Popover>
								&nbsp;&nbsp;&nbsp;&nbsp;  时间段:&nbsp;&nbsp;
								<RangePicker
									format={'yyyy-MM-dd'}
									value={[
										this.state.startDateMoment,
										this.state.endDateMoment,
									]}
									onChange={this.rangePickerChange}
									style={{ width: 220 }}
								/>
								&nbsp;&nbsp;

								<Select
									showSearch
									style={{ width: 80 }}
									placeholder="用户类型"
									optionFilterProp="children"
									onChange={this.handleChange}
								>
									<Option value="0" >新增用户</Option>
									<Option value="1" >活跃用户</Option>
									<Option value="2" >启动用户</Option>
								</Select>

								&nbsp;&nbsp;
								<Button type="primary" icon="search" onClick={this.handleQuery} >查询</Button>

								&nbsp;&nbsp;
								<Button onClick={this.last7DayStat} >近7天</Button>&nbsp;&nbsp;
								<Button onClick={this.last30DayStat} >近30天</Button>

							</Col>

							<Col span={7} style={{ textAlign: 'right' }} >
								<Button type="primary" onClick={this.qryAddNewUser} >新增用户</Button>&nbsp;&nbsp;
								<Button type="primary" onClick={this.qryActiverUsers} >活跃用户</Button>&nbsp;&nbsp;
								<Button type="primary" onClick={this.qryStartUsers} >启动用户</Button>
							</Col>

						</Row>
					</header>
					<Row>
						<Col>
							<Line data={lineChartObj} options={chartOption} />
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}
;

const mapStateToProps = (state) => {
	const { refreshData, rspInfo, useWholeStatistic, newUserList, activeUserList } = state.appStatistic;

	return {
		rspInfo,
		refreshData,
		useWholeStatistic,
		newUserList,
		activeUserList,
	};
};

const mapDispatchToProps = (dispatch) => {
	const { sysMsg, userWholeStatistic, addNewUser, statActiveUser, qryLastUsers } = actions;
	return {
		actions: bindActionCreators({
			sysMsg,
			userWholeStatistic,
			addNewUser,
			statActiveUser,
			qryLastUsers,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserStatistic);
