'use strict';

import React, { PropTypes } from 'react';
import { Form, Button, Input } from 'antd';

export const AppTypeSearchFormCacheKey = 'AppTypeSearchForm';

class AppTypeSearchForm extends React.Component {
	static propTypes = {
		form: PropTypes.object.isRequired,
		handleQuery: PropTypes.func.isRequired,
	};

	constructor (props) {
		super(props);
		this.SearchFormCache = JSON.parse(
			localStorage.getItem(AppTypeSearchFormCacheKey));
	}

	getInitValue = (key) => {
		return this.SearchFormCache && this.SearchFormCache[key]
			? this.SearchFormCache[key]
			: '';
	};

	render () {
		const { getFieldDecorator, getFieldsValue } = this.props.form;

		//App类型名称
		const AppTypeProps = getFieldDecorator('appName', {
			initialValue: this.getInitValue('appName'),
		});

		const query = () => {
			const values = getFieldsValue();
			const qryForm = {};
			if (values.appName) {
				qryForm.appName = values.appName;
			}
			localStorage.setItem(AppTypeSearchFormCacheKey,
				JSON.stringify(qryForm));
			this.props.handleQuery(qryForm);
		};

		return (
			<Form layout="horizontal" style={{ width: '100%' }} >
				应用名称:&nbsp;&nbsp;
				{AppTypeProps(
					<Input
						size="large"
						placeholder="应用名称"
						style={{
							width: 150,
							height: 'auto',
						}}
					/>,
				)}&nbsp;&nbsp;
				<Button type="primary" icon="search" onClick={query} >查询</Button>
			</Form>
		);
	}
}

export default  Form.create()(AppTypeSearchForm);
