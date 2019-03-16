'use strict';

import React, { PropTypes } from 'react';
import moment from 'moment';

import { Button, DatePicker, Form, Select } from 'antd';

const Option = Select.Option;
const { RangePicker } = DatePicker;

class PushInfoSearchForm extends React.Component {

	static propTypes = {
		form: PropTypes.object.isRequired,
		type: PropTypes.number.isRequired,
		handleQuery: PropTypes.func.isRequired,
	};

	constructor (props) {
		super(props);
		this.showDateFormat = 'YYYY-MM-DD HH:mm:ss';
		this.last7DayMoment = moment(currentDate).subtract(7, 'days');
		const currentDate = new Date();
		this.currentDateMoment = moment(currentDate);
		this.state = {
			beginMoment: moment(this.last7DayMoment),
			endMoment: moment(this.currentDateMoment),
		};
	}

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
					util.showwarning('结束时间不允许小于开始时间');
					return;
				}
				qryForm.beginTime = beginTime;
				qryForm.endTime = endTime;
			} else {
				util.showwarning('查询时间段不允许为空');
				return;
			}
			if (values.type) {
				qryForm.type = values.type;
			}
			this.props.handleQuery(qryForm);
		};

		return (
			<Form layout="horizontal" style={{ width: '100%' }} >
				查询时间:&nbsp;&nbsp;
				{BetweenProp(
					<RangePicker format={this.showDateFormat} />,
				)}&nbsp;&nbsp;
				{TypeProp(
					<Select style={{ width: 195 }} disabled >
						<Option value="0" >消息</Option>
						<Option value="1" >通知</Option>
						<Option value="" >全部</Option>
					</Select>,
				)}&nbsp;&nbsp;
				<Button type="primary" icon="search" onClick={query} >查询</Button>
			</Form>
		);
	}
}

export default  Form.create()(PushInfoSearchForm);
