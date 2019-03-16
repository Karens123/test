'use strict';

import React, { PropTypes } from 'react';
import moment from 'moment';
import { Button, DatePicker, Form, Input, Select } from 'antd';
import * as MsgUtil from 'utils/MsgUtil';

const { Option } = Select;
const { RangePicker } = DatePicker;

export const OpinionSearchFormCacheKey = 'OpinionSearchForm';

class OpinionSearchForm extends React.Component {
	static propTypes = {
		form: PropTypes.object.isRequired,
		handleQuery: PropTypes.func.isRequired,
	};

	constructor (props) {
		super(props);
		this.showDateFormat = 'YYYY-MM-DD';
		const currentDate = new Date();
		this.currentDateMoment = moment(currentDate);
		this.last7DayMoment = moment(currentDate).subtract(7, 'days');
		// try {
		//     this.SearchFormCache = JSON.parse(localStorage.getItem(OpinionSearchFormCacheKey));
		// } catch (ex) {
		// }
		// if (!this.SearchFormCache) {
		//     this.state = {
		//         beginMoment: this.last7DayMoment,
		//         endMoment: this.currentDateMoment,
		//     }
		// } else {
		this.state = {
			beginMoment: moment(this.last7DayMoment),
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
		//意见信息
		const AdviceInfoProp = getFieldDecorator('adviceInfo', {
			initialValue: this.getInitValue('adviceInfo'),
		});
		//意见信息
		const WenwenIdProp = getFieldDecorator('wenwenId', {
			initialValue: this.getInitValue('wenwenId'),
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
			} else {
				MsgUtil.showwarning('查询时间段不允许为空');
				return;
			}
			qryForm.qryBean = {};
			if (values.dealSts) {
				qryForm.qryBean.dealSts = values.dealSts;
			}
			if (values.adviceInfo) {
				qryForm.qryBean.adviceInfo = values.adviceInfo;
			}
			if (values.wenwenId) {
				qryForm.qryBean.wenwenId = values.wenwenId;
			}
			localStorage.setItem(OpinionSearchFormCacheKey,
				JSON.stringify(qryForm));
			this.props.handleQuery(qryForm);
		};

		const disabledDate = (current) => {
			return current && current.valueOf() > Date.now();
		};

		return (
			<Form layout="horizontal" style={{ width: 880 }} >
				查询时间段:&nbsp;&nbsp;
				{BetweenProp(
					<RangePicker format={this.showDateFormat} disabledDate={disabledDate} style={{ width: 250 }} />,
				)}&nbsp;&nbsp;
				意见信息:&nbsp;&nbsp;
				{AdviceInfoProp(
					<Input style={{ width: 155 }} />,
				)}
				wenwenId:&nbsp;&nbsp;
				{WenwenIdProp(
					<Input style={{ width: 155 }} />,
				)}
				&nbsp;&nbsp;  处理状态:&nbsp;&nbsp;
				{DealStsProp(
					<Select showSearch style={{ width: 155 }} placeholder="选择处理状态" optionFilterProp="children" >
						<Option value="" >全部</Option>
						<Option value="0" >待处理</Option>
						<Option value="1" >己阅</Option>
						<Option value="2" >已处理</Option>

					</Select>,
				)}&nbsp;&nbsp;
				<Button type="primary" icon="search" onClick={query} >查询</Button>
			</Form>
		);
	}
}

export default  Form.create()(OpinionSearchForm);
