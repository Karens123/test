'use strict';

import React, { PropTypes } from 'react';
import { Button, Form, Input, Select } from 'antd';

export const EntityFormCacheKey = 'EntitySearchForm';

class SysButtonAdminSearchForm extends React.Component {
	static propTypes = {
		form: PropTypes.object.isRequired,
		handleQuery: PropTypes.func.isRequired,
	};

	constructor (props) {
		super(props);
		this.SearchFormCache = JSON.parse(
			localStorage.getItem(EntityFormCacheKey));
	}

	getInitValue = (key) => {
		return this.SearchFormCache && this.SearchFormCache[key]
			? this.SearchFormCache[key]
			: '';
	};

	render () {
		const { getFieldDecorator, getFieldsValue } = this.props.form;
		//权限实体名
		const buttonNameProps = getFieldDecorator('buttonName', {
			initialValue: this.getInitValue('buttonName'),
		});

		const query = () => {
			const values = getFieldsValue();
			const qryForm = {};
			if (values.buttonName) {
				qryForm.buttonName = values.buttonName;
			}

			localStorage.setItem(EntityFormCacheKey, JSON.stringify(qryForm));
			this.props.handleQuery(qryForm);
		};

		return (
			<span>
				功能名称:&nbsp;&nbsp;
				{buttonNameProps(
					<Input
						placeholder="功能名称"
						style={{
							width: 190,
						}}
					/>,
				)}
				&nbsp;&nbsp;
				<Button type="primary" icon="search" onClick={query} >查询</Button>
				&nbsp;&nbsp;
			</span>
		);
	}
}

export default Form.create()(SysButtonAdminSearchForm);
