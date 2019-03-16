'use strict';

import React, { PropTypes } from 'react';
import moment from 'moment';
import { Button, DatePicker, Form, Select,Tabs } from 'antd';

const Option = Select.Option;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
export const HardwareStatisticSearchFormCacheKey = 'HardwareStatticSearchForm';

class UserincrestatSearchForm extends React.Component {

	static propTypes = {
		form: PropTypes.object.isRequired,
		handleQuery: PropTypes.func.isRequired,
	};

	static contextTypes = {
		router: PropTypes.object.isRequired,
		store: PropTypes.object.isRequired,
	};

	constructor (props) {
		super(props);

		this.SearchFormCache = JSON.parse(
			localStorage.getItem(HardwareStatisticSearchFormCacheKey));


		this.showDateFormat = 'YYYY-MM-DD';
		const currentDate = new Date();
		this.currentDateMoment = moment(currentDate).subtract(1, 'days');
		this.last7DayMoment = moment(this.currentDateMoment.format()).subtract(7, 'days');
		this.last30DayMoment = moment(this.currentDateMoment.format()).subtract(30, 'days');
		this.state = {
			beginMoment: this.last7DayMoment,
			endMoment: this.currentDateMoment,
		};
	}

	render () {
		const { getFieldDecorator, getFieldsValue } = this.props.form;


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
				console.log('qryHardwareInfoForm', qryHardwareInfoForm);
				this.props.handleQuery(qryHardwareInfoForm);
			}
		};

		const last7DayStat = () => {
			this.setState({
				beginMoment: last7DayMoment,
				endMoment: currentDateMoment,
			});
		};

		const last30DayStat = () => {
			this.setState({
				beginMoment: last30DayMoment,
				endMoment: currentDateMoment,
			});
		};

		const searchCSS=({
			display: 'flex',
		});
		return (
			<Form layout="horizontal" style={{ width: '100%' }} >
				<div style={searchCSS}>
					查询时间:&nbsp;&nbsp;
					{BetweenProp(
						<RangePicker format={this.showDateFormat} />,
					)}&nbsp;&nbsp;
					<Button onClick={last7DayStat} >近7天</Button>&nbsp;&nbsp;
					<Button onClick={last30DayStat} >近30天</Button>&nbsp;&nbsp;
					<Button type="primary" icon="search" onClick={query} >查询</Button>
				</div>

			</Form>
		);
	}
}

export default Form.create()(UserincrestatSearchForm);