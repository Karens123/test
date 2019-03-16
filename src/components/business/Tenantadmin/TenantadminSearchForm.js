'use strict';

import React, { PropTypes } from 'react';

import { Button, Form, Input, Select } from 'antd';

export const SysUserSearchFormCacheKey = 'SysUserSearchForm';

const Option = Select.Option;
class TenantadminSearchForm extends React.Component {
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
		const tenantIdProp = getFieldDecorator('tenantId', {
			initialValue: this.getInitValue('tenantId'),
		});
		//用户名
		const nameProp = getFieldDecorator('name' ,{
			initialValue: this.getInitValue('name'),

		});
		//用户名称
		const phoneProp = getFieldDecorator('phone', {
			initialValue: this.getInitValue('phone'),
		});

		const query = () => {
			const values = getFieldsValue();

			const qryTenantForm = {};

			if (values.tenantId) {
				qryTenantForm.tenantId = values.tenantId;
			}
			if (values.name) {
				qryTenantForm.name = values.name;
			}
			if (values.phone) {
				qryTenantForm.phone = values.phone;
			}

			localStorage.setItem(SysUserSearchFormCacheKey,
				JSON.stringify(qryTenantForm));


			this.props.handleQuery(qryTenantForm);
		};

		return (
			<Form layout="horizontal" style={{ width: '100%' }} >
				租户ID:&nbsp;&nbsp;
				{tenantIdProp(
					<Input
						size="large"
						style={{
							width: 190, height: 'auto',
						}}
					/>,
				)}&nbsp;&nbsp;
				<Button type="primary" icon="search" onClick={query} >查询</Button>
			</Form>
		);
	}
}

export default Form.create()(TenantadminSearchForm);
