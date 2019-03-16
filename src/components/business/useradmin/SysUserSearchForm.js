'use strict';

import React, { PropTypes } from 'react';

import { Button, Form, Input, Select } from 'antd';

export const SysUserSearchFormCacheKey = 'SysUserSearchForm';

const Option = Select.Option;
class SysUserSearchForm extends React.Component {
	static propTypes = {
		form: PropTypes.object.isRequired,
		handleQuery: PropTypes.func.isRequired,
	};

	constructor (props) {
		super(props);
		this.SearchFormCache = JSON.parse(
			localStorage.getItem(SysUserSearchFormCacheKey));
	}

	getInitValue = (key) => {
		return this.SearchFormCache && this.SearchFormCache[key]
			? this.SearchFormCache[key]
			: '';
	};

	render () {
		const { getFieldDecorator, getFieldsValue } = this.props.form;

		//用户ID
		const UserIdProp = getFieldDecorator('userId', {
			initialValue: this.getInitValue('userId'),
		});
		//用户名
		const UserNameProp = getFieldDecorator('username', {
			initialValue: this.getInitValue('username'),
		});
		//用户名称
		const NameProp = getFieldDecorator('name', {
			initialValue: this.getInitValue('name'),
		});
		//用户状态
		const StateProp = getFieldDecorator('state', {
			initialValue: this.getInitValue('state'),
		});

		const query = () => {
			const values = getFieldsValue();
			const qrySysUserForm = {};
			if (values.userId) {
				qrySysUserForm.userId = values.userId;
			}
			if (values.username) {
				qrySysUserForm.username = values.username;
			}
			if (values.name) {
				qrySysUserForm.name = values.name;
			}
			if (values.state) {
				qrySysUserForm.state = values.state;
			}
			localStorage.setItem(SysUserSearchFormCacheKey,
				JSON.stringify(qrySysUserForm));
			this.props.handleQuery(qrySysUserForm);
		};

		return (
			<Form layout="horizontal" style={{ width: '100%' }} >
				用户ID:&nbsp;&nbsp;
				{UserIdProp(
					<Input
						size="large"
						style={{
							width: 120, height: 'auto',
						}}
					/>,
				)}&nbsp;&nbsp;
				用户名:&nbsp;&nbsp;
				{UserNameProp(
					<Input
						size="large"
						style={{
							width: 120,
							height: 'auto',
						}}
					/>,
				)}&nbsp;
				姓名:&nbsp;&nbsp;
				{NameProp(
					<Input
						size="large"
						style={{
							width: 120,
							height: 'auto',
						}}
					/>,
				)}&nbsp;&nbsp;
				系统状态:&nbsp;
				{StateProp(
					<Select filterOption={false} style={{ width: 120 }} >
						<Option key="All" value="" >全部</Option>
						<Option key="U" value="U" >U-正常</Option>
						<Option key="E" value="E" >E-禁用</Option>
					</Select>,
				)} &nbsp;
				<Button type="primary" icon="search" onClick={query} >查询</Button>
			</Form>
		);
	}
}

export default Form.create()(SysUserSearchForm);
