'use strict';

import React, { PropTypes } from 'react';
import { Button, Form, Input } from 'antd';

export const H5SearchFormCacheKey = 'H5SearchForm';

class H5SearchForm extends React.Component {
	static propTypes = {
		form: PropTypes.object.isRequired,
		handleQuery: PropTypes.func.isRequired,
	};

	constructor (props) {
		super(props);
		this.SearchFormCache = JSON.parse(
			localStorage.getItem(H5SearchFormCacheKey));
	}

	getInitValue = (key) => {
		return this.SearchFormCache && this.SearchFormCache[key]
			? this.SearchFormCache[key]
			: '';
	};

	render () {
		const { getFieldDecorator, getFieldsValue } = this.props.form;

		//数据编码
		const codeTypeProps = getFieldDecorator('codeType', {
			initialValue: this.getInitValue('codeType'),
			placeholder: '数据编码名称',
			filterOption: false,
		});

		const query = () => {
			const values = getFieldsValue();
			const qryForm = {};
			if (values.codeType) {
				qryForm.codeType = values.codeType;
			}
			localStorage.setItem(H5SearchFormCacheKey, JSON.stringify(qryForm));
			this.props.handleQuery(qryForm);
		};

		return (
			<span>
				数据编码:&nbsp;&nbsp;
				{codeTypeProps(
					<Input placeholder="静态数据编码" style={{ width: 150 }} />,
				)}
				&nbsp;&nbsp;&nbsp;&nbsp;
				<Button type="primary" icon="search" onClick={query} >查询</Button>
				&nbsp;&nbsp;
			</span>
		);
	}
}

export default Form.create()(H5SearchForm);
