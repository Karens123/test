'use strict';

import React, { PropTypes } from 'react';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { Button, DatePicker, Table, Form, Select,Tabs,Row, Col, Icon  } from 'antd';
import * as actions from 'action';
import * as DateUtil from 'utils/DateUtil';

import { connect } from 'react-redux';
import HardwareConnectStatisticDetailForm from './HardwareConnectStatisticDetailForm';

export const HardwareStatisticSearchFormCacheKey = 'HardwareStatticSearchForm';

class HardwareStatisticSearchForm extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		actions: PropTypes.object.isRequired,
		recordsDetail: PropTypes.object.isRequired,
	};
	constructor (props) {
		super(props);
		this.SearchFormCache = JSON.parse(
			localStorage.getItem(HardwareStatisticSearchFormCacheKey));
		this.showDateFormat = 'YYYY-MM-DD HH:mm:ss';
		this.last7DayMoment = moment(currentDate).subtract(7, 'days');
		const currentDate = new Date();
		this.currentDateMoment = moment(currentDate);

		this.state = {
			beginMoment: moment(this.last7DayMoment),
			endMoment: moment(this.currentDateMoment),
		};
	}
	componentWillMount () {
		const { actions } = this.props;
		// this.handleQuery();
	}

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
				beginTime: last7DayTime,
				endTime: currentDateTime,
			};
		}
		actions.qryBusiConnect(qryForm);
	};

	render () {
		const { recordsDetail } = this.props;
		const columns = [
			{
				title: '绑定ID',
				dataIndex: 'bindId',
				key: 'bindId',
			}, {
				title: '吻吻ID',
				dataIndex: 'wenwenId',
				key: 'wenwenId',
			},{
				title: '设备序列号',
				dataIndex: 'wenwenSn',
				key: 'wenwenSn',
			}, {
				title: '产品型号',
				dataIndex: 'prodModelnum',
				key: 'prodModelnum',

			}, {
				title: '连接类型',
				dataIndex: 'bindType',
				key: 'bindType',
			}, {
				title: '连接结果',
				dataIndex: 'bindResult',
				key: 'bindResult',

			}, {
				title: '失败原因',
				dataIndex: 'failReason',
				key: 'failReason',

			}, {
				title: '创建日期时间戳',
				dataIndex: 'createTime',
				key: 'createTime',
				render: (text,recordsDetail) => {
				 return DateUtil.parseDateTime(recordsDetail.createTime);
				 },
			},{
				title: '备注',
				dataIndex: 'remark',
				key: 'remark',
			}];


		return (
			<div>
				<HardwareConnectStatisticDetailForm  handleQuery={this.handleQuery}  />
				<Row>
					<Col>
						<Table
							columns={columns}
							rowKey={recordsDetail => recordsDetail.bindId}
							dataSource={recordsDetail}
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
	const { recordsDetail } = state.get('appStatistic').toObject();

	return {
		recordsDetail,
	};
};

const mapDispatchToProps = (dispatch) => {
	const { qryBusiConnect } = actions;
	return {
		actions: bindActionCreators(
			{ qryBusiConnect }, dispatch),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(HardwareStatisticSearchForm));