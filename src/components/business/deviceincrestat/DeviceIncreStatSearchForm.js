'use strict';

import React, { PropTypes } from 'react';
import moment from 'moment';
import { Button, DatePicker, Form } from 'antd';
import * as MsgUtil from 'utils/MsgUtil';

const { RangePicker } = DatePicker;
class DeviceActivationSearchForm extends React.Component {
	static propTypes = {
		handleQuery: PropTypes.func,
		form: PropTypes.object.isRequired,
	};

	static defaultProps = {
		handleQuery: () => {
			console.error('handleQuer undefined');
		},
	};

	constructor (props) {
		super(props);
		this.showDateFormat = 'YYYY-MM-DD';
		const currentDate = new Date();
		this.currentDateMoment = moment(currentDate).subtract(1, 'days');
		this.last7DayMoment = moment(this.currentDateMoment.format()).
			subtract(7, 'days');
		this.last30DayMoment = moment(this.currentDateMoment.format()).
			subtract(30, 'days');
		this.state = {
			beginMoment: this.last7DayMoment,
			endMoment: this.currentDateMoment,
		};
	}

	getInitValue = (key) => {
		return this.SearchFormCache && this.SearchFormCache[key]
			? this.SearchFormCache[key]
			: '';
	};

	render () {
		const { getFieldDecorator, getFieldsValue } = this.props.form;
		const { showDateFormat, currentDateMoment, last7DayMoment, last30DayMoment } = this;

		//设备序列号
		const WenwenSnProp = getFieldDecorator('wenwenSn', {
			initialValue: this.getInitValue('wenwenSn'),
		});

		//激活时间段
		const BetweenProp = getFieldDecorator('between', {
			initialValue: [this.state.beginMoment, this.state.endMoment],
		});

		const query = () => {
			const values = getFieldsValue();
			const { between } = values;
			console.log('between', between);
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

				console.log('values', values);
				console.log('beginTime, endTime', beginTime, endTime);
				this.props.handleQuery(beginTime, endTime);
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
					&nbsp;&nbsp;
					激活时间段:&nbsp;&nbsp;
					{BetweenProp(
						<RangePicker format={showDateFormat} />,
					)}&nbsp;&nbsp;
					<Button onClick={last7DayStat} >近7天</Button>&nbsp;&nbsp;
					<Button onClick={last30DayStat} >近30天</Button>&nbsp;&nbsp;
					<Button type="primary" icon="search" onClick={query} >查询</Button>
				</div>
			</Form>
		);
	}
}

export default Form.create()(DeviceActivationSearchForm);
