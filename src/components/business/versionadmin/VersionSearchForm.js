'use strict';

import React, { PropTypes } from 'react';
import { Button, Form, Input, Select } from 'antd';

export const versionSearchFormCacheKey = 'VersionSearchForm';

class VersionSearchForm extends React.Component {
	static propTypes = {
		form: PropTypes.object.isRequired,
		handleQuery: PropTypes.func.isRequired,
	};

	constructor (props) {
		super(props);
		this.SearchFormCache = JSON.parse(
			localStorage.getItem(versionSearchFormCacheKey));
	}

	getInitValue = (key) => {
		return this.SearchFormCache && this.SearchFormCache[key]
			? this.SearchFormCache[key]
			: '';
	};

	render () {
		const { getFieldDecorator, getFieldsValue } = this.props.form;

		const TypeProp = getFieldDecorator('type', {
			initialValue: this.getInitValue('type'),
			size: 'large',
		});
		const FactoryProp = getFieldDecorator('factory', {
			initialValue: this.getInitValue('factory'),
			size: 'large',
		});
		const DeviceTypeProp = getFieldDecorator('deviceType', {
			initialValue: this.getInitValue('deviceType'),
			size: 'large',
		});
		const MboardTypeProp = getFieldDecorator('mboardType', {
			initialValue: this.getInitValue('mboardType'),
			size: 'large',
		});
		const AppVersionProp = getFieldDecorator('appVersion', {
			initialValue: this.getInitValue('appVersion'),
			size: 'large',
		});
		const VersionCodeProp = getFieldDecorator('versionCode', {
			initialValue: this.getInitValue('versionCode'),
			size: 'large',
		});

		const query = () => {
			const values = getFieldsValue();
			const qryVersionFrom = {};
			if (values.type) {
				qryVersionFrom.type = values.type;
			}
			if (values.factory) {
				qryVersionFrom.factory = values.factory;
			}
			if (values.deviceType) {
				qryVersionFrom.deviceType = values.deviceType;
			}
			if (values.mboardType) {
				qryVersionFrom.mboardType = values.mboardType;
			}
			if (values.appVersion) {
				qryVersionFrom.appVersion = values.appVersion;
			}
			if (values.versionCode) {
				qryVersionFrom.versionCode = values.versionCode;
			}
			localStorage.setItem(versionSearchFormCacheKey,
				JSON.stringify(qryVersionFrom));
			this.props.handleQuery(qryVersionFrom);
		};

		return (
			<Form layout="inline" >
				版本类型:&nbsp;&nbsp;
				{TypeProp(
					<Select style={{ width: 100 }} >
						<Select.Option value="" >all-全部</Select.Option>
						<Select.Option value="0" >0-IOS</Select.Option>
						<Select.Option value="1" >1-ANDROID</Select.Option>
						<Select.Option value="2" >2-WEB</Select.Option>
						<Select.Option value="4" >4-固件</Select.Option>
					</Select>,
				)}&nbsp;&nbsp;
				固件厂商:&nbsp;&nbsp;
				{FactoryProp(
					<Input style={{ width: 100 }} />,
				)}&nbsp;&nbsp;
				固件设备类型:&nbsp;&nbsp;
				{DeviceTypeProp(
					<Select style={{ width: 100 }} >
						<Select.Option value="" >all-全部</Select.Option>
						<Select.Option value="1" >1-戒指</Select.Option>
						<Select.Option value="2" >2-手串</Select.Option>
						<Select.Option value="3" >3-项链</Select.Option>
						<Select.Option value="4" >4-手链</Select.Option>
					</Select>,
				)}&nbsp;&nbsp;
				固件主板类型:&nbsp;&nbsp;
				{MboardTypeProp(
					<Select style={{ width: 100 }} >
						<Select.Option value="" >all-全部</Select.Option>
						<Select.Option value="1" >1-椭圆</Select.Option>
						<Select.Option value="2" >2-方型</Select.Option>
					</Select>,
				)}
				<br /><br />
				App版本:&nbsp;&nbsp;
				{AppVersionProp(
					<Input style={{ width: 100 }} />,
				)}&nbsp;&nbsp;
				版本编码:&nbsp;&nbsp;
				{VersionCodeProp(
					<Input style={{ width: 100 }} />,
				)}&nbsp;&nbsp;
				<Button type="primary" icon="search" onClick={query} >查询</Button>
			</Form>
		);
	}
}

export default  Form.create()(VersionSearchForm);
