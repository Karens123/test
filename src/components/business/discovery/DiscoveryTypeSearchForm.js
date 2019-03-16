'use strict';

import React, { PropTypes } from 'react';
import MySelect from 'framework/components/Select';

import { Button, Form, Input, Select } from 'antd';

export const DiscoveryTypeSearchFormCacheKey = 'DiscoveryTypeSearchForm';

const Option = Select.Option;
class DiscoveryTypeSearchForm extends React.Component {
	static propTypes = {
		staticDataList: PropTypes.array,
		handleQuery: PropTypes.func.isRequired,
		form: PropTypes.object.isRequired,
	};

	static defaultProps = {
		staticDataList: [],
	};

	constructor (props) {
		super(props);
		this.SearchFormCache = JSON.parse(
			localStorage.getItem(DiscoveryTypeSearchFormCacheKey));
	}

	getInitValue = (key) => {
		return this.SearchFormCache && this.SearchFormCache[key]
			? this.SearchFormCache[key]
			: '';
	};

	render () {
		const { getFieldDecorator, getFieldsValue } = this.props.form;

		//发现名称
		const NameProp = getFieldDecorator('name', {
			initialValue: this.getInitValue('name'),
		});
		//发现样式
		const StyleProp = getFieldDecorator('style', {
			initialValue: this.getInitValue('style'),
		});

		const query = () => {
			const values = getFieldsValue();
			const qryDiscoveryTypeInfoForm = {};
			if (values.name) {
				qryDiscoveryTypeInfoForm.name = values.name;
			}
			if (values.style) {
				qryDiscoveryTypeInfoForm.style = values.style;
			}
			localStorage.setItem(DiscoveryTypeSearchFormCacheKey,
				JSON.stringify(qryDiscoveryTypeInfoForm));
			this.props.handleQuery(qryDiscoveryTypeInfoForm);
		};

		return (
			<Form layout="horizontal" style={{ width: '100%' }} >
				发现名称:&nbsp;&nbsp;
				{NameProp(
					<Input
						placeholder="发现名称"
						size="large"
						style={{
							width: 150,
							height: 'auto',
						}}
					/>,
				)}&nbsp;&nbsp;
				发现样式:&nbsp;&nbsp;
				{StyleProp(
					<MySelect
						filterOption={false}
						style={{ width: 150 }}
						valueKey="codeValue"
						descKey="codeName"
						selectOptionDataList={this.props.staticDataList}
					>
						<Option key="All" value="" >全部</Option>
					</MySelect>,
				)}
				&nbsp;&nbsp;
				<Button type="primary" icon="search" onClick={query} >查询</Button>
			</Form>
		);
	}
}

export default Form.create()(DiscoveryTypeSearchForm);
