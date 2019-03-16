'use strict';

import React, { PropTypes } from 'react';
import MySelect from 'framework/components/Select';

import { Button, Form, Input, Select } from 'antd';

const Option = Select.Option;

export const DeviceSearchFormCacheKey = 'DeviceSearchForm';
let DeviceSearchFormCache;

const getInitValue = (key) => {
	return DeviceSearchFormCache && DeviceSearchFormCache[key]
		? DeviceSearchFormCache[key]
		: '';
};

class DeviceSearchForm extends React.Component {
	static propTypes = {
		prodInfoList: PropTypes.array,
		handleQuery: PropTypes.func,
		form: PropTypes.object.isRequired,
	};

	static defaultProps = {
		prodInfoList: [],
		handleQuery: () => {
			console.error('handleQuer undefined');
		},
	};

	componentDidMount () {
		DeviceSearchFormCache = JSON.parse(
			localStorage.getItem(DeviceSearchFormCacheKey));
	}

	render () {
		const { getFieldDecorator, getFieldsValue } = this.props.form;

		//序列号
		const wenwenSnProp = getFieldDecorator('wenwenSn', {
			initialValue: getInitValue('wenwenSn'),
		});
		//订单号
		const OrderSnProp = getFieldDecorator('orderSn', {
			initialValue: getInitValue('orderSn'),
		});
		//产品编号
		const ProdIdProp = getFieldDecorator('prodId', {
			initialValue: getInitValue('prodId'),
		});

		const query = () => {
			const values = getFieldsValue();
			const qryDeviceInfoForm = {};
			if (values.wenwenSn) {
				qryDeviceInfoForm.wenwenSn = values.wenwenSn;
			}
			if (values.orderSn) {
				qryDeviceInfoForm.orderSn = values.orderSn;
			}
			if (values.prodId) {
				qryDeviceInfoForm.prodId = values.prodId;
			}
			localStorage.setItem(DeviceSearchFormCacheKey,
				JSON.stringify(qryDeviceInfoForm));
			this.props.handleQuery(qryDeviceInfoForm);
		};

		return (
			<span >吻吻序列号:&nbsp;&nbsp;
				{wenwenSnProp(
					<Input
						size="large"
						style={{
							width: 150,
							height: 'auto',
						}}
					/>,
				)}
				&nbsp;&nbsp;
				订单编号:&nbsp;&nbsp;
				{OrderSnProp(
					<Input
						size="large"
						style={{
							width: 150,
							height: 'auto',
						}}
					/>,
				)}&nbsp;&nbsp;
				产品编号:&nbsp;&nbsp;
				{ProdIdProp(
					<MySelect
						filterOption={false}
						style={{ width: 150 }}
						valueKey="prodId"
						descKey="prodName"
						selectOptionDataList={this.props.prodInfoList}
					>
						<Option key="All" value="" >全部</Option>
					</MySelect>,
				)}&nbsp;&nbsp;
				<Button type="primary" icon="search" onClick={query} >查询</Button>
			</span>
		);
	}
}

export default  Form.create()(DeviceSearchForm);
