'use strict';

import React, { PropTypes } from 'react';
import { Form, Button, Select } from 'antd';
import MySelect from 'framework/components/Select';
import SelectData from './SelectData.json';

export const BeadsApplicationSearchFormCacheKey = 'BeadsApplicationSearchForm';
const Option = Select.Option;
class BeadsApplicationSearchForm extends React.Component {

	static propTypes = {
		handleQuery: PropTypes.func,
		form: PropTypes.object.isRequired,
	};

	static defaultProps = {
		handleQuery: () => {
			console.error('handle Query undefined');
		},
	};

	constructor (props) {
		super(props);
		this.SearchFormCache = JSON.parse(
			localStorage.getItem(BeadsApplicationSearchFormCacheKey));
	}

	getInitValue = (key) => {
		return this.SearchFormCache && this.SearchFormCache[key]
			? this.SearchFormCache[key]
			: '';
	};

	render () {
		const { getFieldDecorator, getFieldsValue } = this.props.form;

		//模块key下拉
		const StateProp = getFieldDecorator('state', {
			initialValue: this.getInitValue('state'),
		});

		const query = () => {
			const values = getFieldsValue();
			const record = {};
			const stateList = [];
			if (values.state) {
				stateList.push(values.state);
			}
			localStorage.setItem(BeadsApplicationSearchFormCacheKey,
				JSON.stringify(record));
			this.props.handleQuery(record, stateList);
		};

		return (
			<Form layout="horizontal" style={{ width: '100%' }} >
				{StateProp(
					<MySelect
						filterOption={false}
						style={{ width: 110 }}
						valueKey="key"
						descKey="desc"
						selectOptionDataList={SelectData.stateDataList}
					>
						<Option key="All" value="" >全部</Option>
					</MySelect>,
				)}
				&nbsp;&nbsp;
				<Button
					type="primary" icon="search"
					onClick={query}
				>查询</Button>
			</Form>
		);
	}
}

export default Form.create()(BeadsApplicationSearchForm);
