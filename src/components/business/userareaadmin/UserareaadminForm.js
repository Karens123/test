'use strict';

import React, { PropTypes } from 'react';
import moment from 'moment';
import { Link } from 'react-router';
import { Button, DatePicker, Table, Form, Select,Tabs,Row, Col, Icon  } from 'antd';
import * as MsgUtil from 'utils/MsgUtil';
import * as businessRoute from 'business/route';

const Option = Select.Option;
const { RangePicker } = DatePicker;
// const HardwareConnectStatisticDetailFormCacheKey = 'HardwareConnectStatisticDetailFormCacheKey';


class UserareaadminForm extends React.Component {
	static propTypes = {
		type: PropTypes.number.isRequired,
		handleQuery: PropTypes.func.isRequired,
		form: PropTypes.object.isRequired,
	};


	constructor (props) {
		super(props);
/*		this.SearchFormCache = JSON.parse(
			localStorage.getItem(HardwareConnectStatisticDetailFormCacheKey));*/
		this.showDateFormat = 'YYYY-MM-DD HH:mm:ss';
		this.last7DayMoment = moment(currentDate).subtract(7, 'days');
		const currentDate = new Date();
		this.currentDateMoment = moment(currentDate);

		this.state = {
			beginMoment: moment(this.last7DayMoment),
			endMoment: moment(this.currentDateMoment),
		};
	}

	getInitValue = (key) => {
		return this.SearchFormCache && this.SearchFormCache[key]
			? this.SearchFormCache[key]
			: '';
	};

	render () {
		const { getFieldDecorator, getFieldsValue } = this.props.form;

		//推送信息类型
		const TypeProp = getFieldDecorator('type', {
			initialValue: this.props.type ? String(this.props.type) : '0',
		});

		//查询时间段
		const BetweenProp = getFieldDecorator('between', {
			initialValue: [this.state.beginMoment, this.state.endMoment],
			rules: [{ type: 'array', required: true, message: '请选择查询时间段' }],
		});

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

		const query = () => {
			const values = getFieldsValue();
			const { between } = values;

			if (between) {

				const beginTime = moment(between[0]).toDate().getTime();
				const endTime = moment(between[1]).toDate().getTime();

				const currentDate = new Date();
				const currentDateTime = moment(
					`${moment(currentDate).format('YYYYMMDD')}235959`,
					'YYYYMMDDhhmmss').toDate().getTime();
				const last7DayTime = moment(
					moment(currentDate).subtract(7, 'days').format('YYYYMMDD'),
					'YYYYMMDDhhmmss').toDate().getTime();

				if (endTime < beginTime) {
					MsgUtil.showwarning('结束时间不允许小于开始时间');
					return;
				}
				if ((endTime - beginTime) / (24 * 60 * 60 * 1000) > 90) {
					MsgUtil.showwarning('时间间隔不允许超过90天');
					return;
				}

				const qryHardwareInfoForm = {
					beginTime: last7DayTime,
					endTime: currentDateTime,
					record: {
					},
				};
				if (values.bindResult) {
					qryHardwareInfoForm.record.bindResult = values.bindResult;
				} else {
					qryHardwareInfoForm.beginTime = beginTime;
					qryHardwareInfoForm.endTime = endTime;
				}

				/*localStorage.setItem(HardwareConnectStatisticDetailFormCacheKey,
					JSON.stringify(qryHardwareInfoForm));
*/
				this.props.handleQuery(qryHardwareInfoForm);
			}
		};

		const disabledDate = (current) => {
			return current && current.valueOf() > Date.now();
		};
		//连接状态
		const bindResultProp = getFieldDecorator('bindResult', {
			initialValue: this.getInitValue('bindResult'),
		});
		return (
			<form>
				<Row>
					<Col style={statsticCss.titleBar}><Icon type="idcard" />  用户地域统计与分析
					</Col>
				</Row>
				<Row>
					<Col>
						&nbsp;
					</Col>
				</Row>
				查询时间:&nbsp;&nbsp;
				{BetweenProp(
					<RangePicker format={this.showDateFormat} disabledDate={disabledDate} />,
				)}&nbsp;&nbsp;
				{bindResultProp(
					<Select showSearch style={{ width: 155 }} placeholder="选择连接状态" optionFilterProp="children" >
						<Option value="0" >成功</Option>
						<Option value="1" >失败</Option>
						<Option value="" >全部</Option>
					</Select>,
				)} &nbsp;&nbsp;
				<Button type="primary" icon="search" onClick={query} >查询</Button>
				<Row>
					<Col style={{ height: 35 }}>
						&nbsp;
					</Col>
				</Row>
			</form>
		);
	}
}

export default Form.create()(UserareaadminForm);