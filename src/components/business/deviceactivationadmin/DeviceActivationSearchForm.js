'use strict';

import React, { PropTypes } from 'react';
import moment from 'moment';
import { Button, DatePicker, Form, Input } from 'antd';

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
		// this.SearchFormCache = JSON.parse(localStorage.getItem(DeviceActivationSearchFormCacheKey));
		this.state = {
			beginMoment: undefined,
			endMoment: undefined,
		};
	}

	getInitValue = (key) => {
		return this.SearchFormCache && this.SearchFormCache[key]
			? this.SearchFormCache[key]
			: '';
	};

	render () {
		const { getFieldDecorator, getFieldsValue } = this.props.form;
		const { showDateFormat } = this;

		//吻吻序列号
		const WenwenSnProp = getFieldDecorator('wenwenSn', {
			initialValue: this.getInitValue('wenwenSn'),
		});

		//激活时间段
		const BetweenProp = getFieldDecorator('between', {
			initialValue: [this.state.beginMoment, this.state.endMoment],
		});
		const query = () => {
			const values = getFieldsValue();
			const qryBeanForm = {};
			if (values.wenwenSn) {
				qryBeanForm.wenwenSn = values.wenwenSn;
			}

			/*const { between } = values;
			let beginActivitedTime;
			let endActivitedTime;
			if (between) {
				beginActivitedTime = moment(between[0]).toDate().getTime();
				endActivitedTime = moment(between[1]).toDate().getTime();
			}*/
			// localStorage.setItem(DeviceActivationSearchFormCacheKey, JSON.stringify(qryBeanForm));
			// this.props.handleQuery(qryBeanForm, beginActivitedTime, endActivitedTime);

			console.log('qryBeanForm________________', qryBeanForm);
			this.props.handleQuery(qryBeanForm);


		};

		return (
			<Form layout="horizontal" style={{ width: '100%' }} >
				吻吻序列号:&nbsp;&nbsp;
				{WenwenSnProp(
					<Input
						placeholder="吻吻序列号"
						size="large"
						style={{
							width: 206,
							height: 'auto',
						}}
					/>,
				)}&nbsp;&nbsp;
				{/*
			 激活时间段:&nbsp;&nbsp;{BetweenProp(
					<RangePicker format={showDateFormat} />,
				)}&nbsp;&nbsp;*/}
				<Button type="primary" icon="search" onClick={query} >查询</Button>
			</Form>
		);
	}
}

export default Form.create()(DeviceActivationSearchForm);
