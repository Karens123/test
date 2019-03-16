'use strict';

import React, { PropTypes } from 'react';
import { Form, Button, Select } from 'antd';
import MySelect from 'framework/components/Select';
import SelectData from  './SelectData.json';

export const AppStaticResSearchFormCacheKey = 'AppStaticResSearchForm';
const Option = Select.Option;
class AppStaticResSearchForm extends React.Component {

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
			localStorage.getItem(AppStaticResSearchFormCacheKey));
	}

	getInitValue = (key) => {
		return this.SearchFormCache && this.SearchFormCache[key]
			? this.SearchFormCache[key]
			: '';
	};

	render () {
		const { getFieldDecorator, getFieldsValue } = this.props.form;

		//模块key下拉
		const ModuleKeyProp = getFieldDecorator('moduleKey', {
			initialValue: this.getInitValue('moduleKey'),
		});
		//app版本
		const LanguageProp = getFieldDecorator('language', {
			initialValue: this.getInitValue('language'),
		});
		//分辨率
		const ResolutionProp = getFieldDecorator('resolution', {
			initialValue: this.getInitValue('resolution'),
		});
		//状态
		const StateProp = getFieldDecorator('state', {
			initialValue: this.getInitValue('state'),
		});

		const query = () => {
			const values = getFieldsValue();
			const qryAppStaticResInfoForm = {};
			if (values.moduleKey) {
				qryAppStaticResInfoForm.moduleKey = values.moduleKey;
			}
			if (values.resolution) {
				qryAppStaticResInfoForm.resolution = values.resolution;
			}
			if (values.state) {
				qryAppStaticResInfoForm.state = values.state;
			}
			if (values.language) {
				qryAppStaticResInfoForm.language = values.language;
			}
			localStorage.setItem(AppStaticResSearchFormCacheKey,
				JSON.stringify(qryAppStaticResInfoForm));
			this.props.handleQuery(qryAppStaticResInfoForm);
		};

		return (
			<Form layout="horizontal" style={{ width: '100%' }} >
				模块Key:&nbsp;&nbsp;
				{ModuleKeyProp(
					<MySelect
						filterOption={false}
						style={{ width: 110 }}
						valueKey="key"
						descKey="desc"
						selectOptionDataList={SelectData.moduleKeyDataList}
					>
						<Option key="All" value="" >全部</Option>
					</MySelect>,
				)}&nbsp;&nbsp;
				语言:&nbsp;&nbsp;
				{LanguageProp(
					<Select
						filterOption={false}
						style={{ width: 110 }}
					>
						<Select.Option key="All" value="" >全部</Select.Option>
						<Select.Option key="zh" value="zh" >中文</Select.Option>
						<Select.Option key="en" value="en" >英文</Select.Option>
					</Select>,
				)}&nbsp;&nbsp;
				&nbsp;分辨率:&nbsp;&nbsp;
				{ResolutionProp(
					<MySelect
						filterOption={false}
						style={{ width: 110 }}
						valueKey="key"
						descKey="desc"
						selectOptionDataList={SelectData.resolutionDataList}
					>
						<Option key="All" value="" >全部</Option>
					</MySelect>,
				)}
				&nbsp;  状态:&nbsp;&nbsp;
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

export default Form.create()(AppStaticResSearchForm);
