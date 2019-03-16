'use strict';

import React, { PropTypes } from 'react';
import { Button, Form, Input, Tooltip } from 'antd';

export const roleAdminSearchFormCacheKey = 'roleAdminSearchForm';

class RoleAdminSearchForm extends React.Component {
	static propTypes = {
		form: PropTypes.object.isRequired,
		handleQuery: PropTypes.func.isRequired,
	};

	constructor (props) {
		super(props);
		this.SearchFormCache = JSON.parse(
			localStorage.getItem(roleAdminSearchFormCacheKey));
	}

	getInitValue = (key) => {
		return this.SearchFormCache && this.SearchFormCache[key]
			? this.SearchFormCache[key]
			: '';
	};

	render () {
		const { getFieldDecorator, getFieldsValue } = this.props.form;

		//产品名称
		const roleNameProps = getFieldDecorator('roleName', {
			initialValue: this.getInitValue('roleName'),
			placeholder: '请输入角色名称',
			filterOption: false,
		});

		const query = () => {
			const values = getFieldsValue();
			const qryForm = {};
			if (values.roleName) {
				qryForm.roleName = values.roleName;
			}
			localStorage.setItem(roleAdminSearchFormCacheKey,
				JSON.stringify(qryForm));
			this.props.handleQuery(qryForm);
		};

		return (
			<span>
				角色名: &nbsp;&nbsp;
				<Tooltip title="输入查询的角色名" >
					{roleNameProps(
						<Input style={{ width: 150 }} placeholder="角色名" />,
					)}
				</Tooltip>
				&nbsp;&nbsp;&nbsp;&nbsp;
				<Button type="primary" icon="search" onClick={query} >查询</Button>
				&nbsp;&nbsp;
			</span>
		);
	}
}

export default Form.create()(RoleAdminSearchForm);
