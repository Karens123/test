'use strict';

import React, { PropTypes } from 'react';
import moment from 'moment';
import { Button, DatePicker, Form, Select } from 'antd';
import * as MsgUtil from 'utils/MsgUtil';

export const ErrorLogSearchFormCacheKey = 'ErrorLogSearchForm';

const { Option } = Select;
const { RangePicker } = DatePicker;
class ErrorLogSearchForm extends React.Component {
	static propTypes = {
		handleQuery: PropTypes.func.isRequired,
		form: PropTypes.object.isRequired,
	};

	constructor (props) {
		super(props);
		this.showDateFormat = 'YYYY-MM-DD';
		const currentDate = new Date();
		this.currentDateMoment = moment(currentDate);
		this.last30DayMoment = moment(currentDate).subtract(30, 'days');
		// try {
		//     this.SearchFormCache = JSON.parse(localStorage.getItem(ErrorLogSearchFormCacheKey));
		// } catch (ex) {
		// }
		// if (!this.SearchFormCache) {
		//     this.state = {
		//         beginMoment: this.last30DayMoment,
		//         endMoment: this.currentDateMoment,
		//     }
		// } else {
		this.state = {
			beginMoment: moment(this.last30DayMoment),
			endMoment: moment(this.currentDateMoment),
		};
		// }
	}

	getInitValue = (key) => {
		return this.SearchFormCache && this.SearchFormCache[key]
			? this.SearchFormCache[key]
			: '';
	};

	render () {
		const { getFieldDecorator, getFieldsValue } = this.props.form;

		//查询时间段
		const BetweenProp = getFieldDecorator('between', {
			initialValue: [this.state.beginMoment, this.state.endMoment],
			rules: [{ type: 'array', required: true, message: '请选择错误时间段' }],
		});
		//处理状态
		const DealStsProp = getFieldDecorator('dealSts', {
			initialValue: this.getInitValue('dealSts'),
		});

		const query = () => {
			const values = getFieldsValue();
			const qryForm = {};
			if (values.between && values.between.length === 2) {
				const beginTime = moment(values.between[0].format('YYYYMMDD'),
					'YYYYMMDDhhmmss').toDate().getTime();
				const endTime = moment(
					`${values.between[1].format('YYYYMMDD')}235959`,
					'YYYYMMDDhhmmss').toDate().getTime();
				if (endTime < beginTime) {
					MsgUtil.showwarning('结束时间不允许小于开始时间');
					return;
				}
				if ((endTime - beginTime) / (24 * 60 * 60 * 1000) > 90) {
					MsgUtil.showwarning('时间间隔不允许超过90天');
					return;
				}
				qryForm.beginTime = beginTime;
				qryForm.endTime = endTime;

				console.log('beginTime', qryForm.beginTime);
				console.log('endTime', qryForm.endTime);


			} else {
				MsgUtil.showwarning('查询时间段不允许为空');
				return;
			}
			qryForm.qryBean = {};
			if (values.dealSts) {
				qryForm.qryBean.dealSts = values.dealSts;
			}
			localStorage.setItem(ErrorLogSearchFormCacheKey,
				JSON.stringify(qryForm));
			this.props.handleQuery(qryForm);
		};

		const disabledDate = (current) => {
			return current && current.valueOf() > Date.now();
		};

		return (
			<Form layout="horizontal" style={{ width: '100%' }} >
				查询时间段:&nbsp;&nbsp;
				{BetweenProp(
					<RangePicker format={this.showDateFormat} disabledDate={disabledDate} />,
				)}&nbsp;&nbsp;
				处理状态&nbsp;&nbsp;
				{DealStsProp(
					<Select showSearch style={{ width: 195 }} placeholder="选择处理状态" optionFilterProp="children" >
						<Option value="0" >待处理</Option>
						<Option value="1" >己阅</Option>
						<Option value="2" >已处理</Option>
						<Option value="" >全部</Option>
					</Select>,
				)}&nbsp;&nbsp;
				<Button type="primary" icon="search" onClick={query} >查询</Button>
			</Form>
		);
	}
}

export default Form.create()(ErrorLogSearchForm);
