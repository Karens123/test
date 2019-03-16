'use strict';

import React, { PropTypes } from 'react';
import { Button, Form, Input, Select } from 'antd';
import MySelect from 'framework/components/Select';

const Option = Select.Option;

export const ProdSearchFormCacheKey = 'ProdSearchForm';

class ProdSearchForm extends React.Component {
	static propTypes = {
		form: PropTypes.object.isRequired,
		handleQuery: PropTypes.func.isRequired,
		staticDataList: PropTypes.array.isRequired,
		mboardTypeList: PropTypes.array.isRequired,
	};

	constructor (props) {
		super(props);
		this.SearchFormCache = JSON.parse(
			localStorage.getItem(ProdSearchFormCacheKey));
	}

	getInitValue = (key) => {
		return this.SearchFormCache && this.SearchFormCache[key]
			? this.SearchFormCache[key]
			: '';
	};

	render () {
		const { getFieldDecorator, getFieldsValue } = this.props.form;

		//产品名称
		const ProdNameProps = getFieldDecorator('prodName', {
			initialValue: this.getInitValue('prodName'),
			placeholder: '请输入产品名称',
			filterOption: false,
		});
		//产品类别
		const ProdTypeProps = getFieldDecorator('prodType', {
			initialValue: this.getInitValue('prodType'),
			placeholder: '请选择产品类别',
			filterOption: false,
		});
		//主板类型
		const MboardTypeProps = getFieldDecorator('mboardType', {
			initialValue: this.getInitValue('mboardType'),
			placeholder: '请选择产品类型',
			filterOption: false,
		});

		const query = () => {
			const values = getFieldsValue();
			const qryForm = {};
			if (values.prodType) {
				qryForm.prodType = values.prodType;
			}
			if (values.mboardType) {
				qryForm.mboardType = values.mboardType;
			}
			if (values.deviceType) {
				qryForm.deviceType = values.deviceType;
			}
			if (values.prodName) {
				qryForm.prodName = values.prodName;
			}
			localStorage.setItem(ProdSearchFormCacheKey,
				JSON.stringify(qryForm));
			this.props.handleQuery(qryForm);
		};

		return (
			<Form layout="horizontal" style={{ width: '100%' }} >
				产品名称:&nbsp;&nbsp;
				{ProdNameProps(
					<Input
						size="large"
						style={{
							width: 150,
							height: 'auto',
						}}
					/>,
				)}
				&nbsp;&nbsp;
				产品类别:&nbsp;&nbsp;
				{ProdTypeProps(
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
				主板类型:&nbsp;&nbsp;
				{MboardTypeProps(
					<MySelect
						filterOption={false}
						style={{ width: 150 }}
						valueKey="value"
						descKey="desc"
						selectOptionDataList={this.props.mboardTypeList}
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

export default  Form.create()(ProdSearchForm);
