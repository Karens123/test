'use strict';

import React, { PropTypes } from 'react';
import { Button, DatePicker, Form, Input, Select } from 'antd';

const { Option } = Select;
export const AllBusinessesSearchFormCacheKey = 'AllBusinessesSearchForm';

class AllBusinessesSearchForm extends React.Component {
	static propTypes = {
		form: PropTypes.object.isRequired,
		handleQuery: PropTypes.func.isRequired,
		DeviceType: PropTypes.number.isRequired,
		handleDemandQuery: PropTypes.func.isRequired,
	};
	constructor (props) {
		super(props);
		this.state = {
			pageSize: 10,
			currentPage: 1,       //当前选中的分页
		};
	}
	getInitValue = (key) => {
		return this.SearchFormCache && this.SearchFormCache[key] ? this.SearchFormCache[key] : '';
	};
	query = (key) => {
		const qryForm={};
		if (key) {
			qryForm.state = key;
		}

		//1-审核中,3-审核失败
		const { DeviceType } =this.props;
		if (DeviceType==2) { //需求是1 ,作品是2
			this.props.handleQuery(this.state.currentPage, this.state.pageSize,qryForm);
		} else {
			this.props.handleDemandQuery(this.state.currentPage, this.state.pageSize,qryForm);
		}


	};

	render () {
		const { getFieldDecorator, getFieldsValue, } = this.props.form;

		const BusinessesProp = getFieldDecorator('state', {
			initialValue: this.getInitValue('state'),
		});

		return (
			<Form layout="horizontal"  >
				 {BusinessesProp(
					 <Select
						 filterOption={false}
						 style={{ width: 120 }}
						 onChange={this.query}
					 >
						<Option key="All" value="" >全部</Option>
						<Option key="1" value="1" >审核中</Option>
						<Option key="3" value="2" >未通过</Option>
					</Select>,
				)}
				&nbsp;&nbsp;
			</Form>
		);
	}
}

export default  Form.create()(AllBusinessesSearchForm);
