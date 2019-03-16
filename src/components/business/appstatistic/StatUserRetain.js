'use strict';

import 'moment/locale/zh-cn';
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table } from 'antd';
import * as actions from 'action';
import * as MsgUtil from 'utils/MsgUtil';

const showDateFormat = 'YYYY-MM-DD';
const currentDate = new Date();

class StatUserRetain extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		userRetainList: PropTypes.array,
		rspInfo: PropTypes.object,
	};
	static defaultProps = {
		userRetainList: [],
		rspInfo: undefined,
	};

	constructor (props, context) {
		super(props, context);
		this.state = {
			userType: '',//用户类型
		};
	}

	//每次更新时被调用
	componentDidUpdate () {
		const { rspInfo } = this.props;
		if (rspInfo && rspInfo.resultCode != 0) {
			MsgUtil.showwarning(
				`查询失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
		}
	}

	//表格分页
	pagination = (data) => {
		const component = this;
		if (data == undefined) {
			data = [];
		}
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
		const { userRetainList } = this.props;

		const columns = [
			{
				title: '日期',
				dataIndex: 'statDate',
				key: 'statDate',
			}, {
				title: '新增用户数',
				dataIndex: 'newUserCnt',
				key: 'newUserCnt',
			}, {
				title: '次日留存率',
				dataIndex: 'nextDayRetain',
				key: 'nextDayRetain',
			},
			{
				title: '三日',
				dataIndex: 'threeDayRetain',
				key: 'threeDayRetain',
			},
			{
				title: '四日',
				dataIndex: 'fourDayRetain',
				key: 'fourDayRetain',
			},
			{
				title: '五日',
				dataIndex: 'fiveDayRetain',
				key: 'fiveDayRetain',
			},
			{
				title: '六日',
				dataIndex: 'sixDayRetain',
				key: 'sixDayRetain',
			},

			{
				title: '七日',
				dataIndex: 'sevenDayRetain',
				key: 'sevenDayRetain',
			},
			{
				title: '30日',
				dataIndex: 'thirtyDayRetain',
				key: 'thirtyDayRetain',
			},

		];

		return (
			<div>
				<Table
					columns={columns}
					onRowClick={this.handleRowClk}
					rowKey={record => record.statDate}
					dataSource={userRetainList}
					pagination={this.pagination(userRetainList)}
				/>
			</div>
		);
	}
}
;
const mapStateToProps = (state) => {
	const { actionType, rspInfo } = state.get('RootService').toObject();
	const { userRetainList, refreshData } = state.get('appStatistic').
		toObject();
	return {
		rspInfo,
		refreshData,
		userRetainList,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({ sysMsg: actions.sysMsg }, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(StatUserRetain);
