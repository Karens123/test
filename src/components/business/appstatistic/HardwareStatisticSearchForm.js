'use strict';

import React, { PropTypes } from 'react';
import moment from 'moment';
import { Button, DatePicker, Form, Select,Tabs,Input,Row, Col, Table, } from 'antd';
import * as MsgUtil from 'utils/MsgUtil';

const Option = Select.Option;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
export const HardwareStatisticSearchFormCacheKey = 'HardwareStatticSearchForm';


class HardwareStatisticSearchForm extends React.Component {
	static propTypes = {
		form: PropTypes.object.isRequired,
		type: PropTypes.number.isRequired,
		handleQuery: PropTypes.func.isRequired,
	};

	constructor (props) {
		super(props);

		this.SearchFormCache = JSON.parse(localStorage.getItem(HardwareStatisticSearchFormCacheKey));
		this.showDateFormat = 'YYYY-MM-DD HH:mm:ss';
		this.last7DayMoment = moment(currentDate).subtract(7, 'days');
		const currentDate = new Date();
		this.currentDateMoment = moment(currentDate);

		this.state = {
			beginMoment: moment(this.last7DayMoment),
			endMoment: moment(this.currentDateMoment),
		};
	}

	handleChange = (value) => {
		console.log(`selected ${value}`);
	};
	render () {
		const { getFieldDecorator, getFieldsValue } = this.props.form;
		const searchCSS=({
			display: 'flex',
		});
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
			const { between } = values;

			if (between) {

				const beginTime = moment(between[0]).toDate().getTime();
				const endTime = moment(between[1]).toDate().getTime();


				if (endTime < beginTime) {
					MsgUtil.showwarning('结束时间不允许小于开始时间');
					return;
				}
				if ((endTime - beginTime) / (24 * 60 * 60 * 1000) > 90) {
					MsgUtil.showwarning('时间间隔不允许超过90天');
					return;
				}

				const qryHardwareInfoForm = {};

				if (values.name) {
					qryHardwareInfoForm.name = values.name;
				} else {
					qryHardwareInfoForm.beginTime = beginTime;
					qryHardwareInfoForm.endTime = endTime;
				}
				if (values.style) {
					qryHardwareInfoForm.style = values.style;
				}

				localStorage.setItem(HardwareStatisticSearchFormCacheKey,
					JSON.stringify(qryHardwareInfoForm));

				this.props.handleQuery(qryHardwareInfoForm);
			}
		};
		return (
			<Form layout="horizontal" style={{ width: '100%' }} >
				<div style={searchCSS}>
					查询时间:&nbsp;&nbsp;
					{BetweenProp(
						<RangePicker format={this.showDateFormat} />,
					)}
					&nbsp;&nbsp;
					<Button type="primary" icon="search" onClick={query} >查询</Button>
				</div>

			</Form>
		);
	}
}

export default Form.create()(HardwareStatisticSearchForm);