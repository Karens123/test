'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Col, Row, Table, Tabs, Select, Pagination, Modal, Input, Form, Icon } from 'antd';
import { parseDate, parseDateTime } from 'utils/DateUtil';
import * as MsgUtil from 'utils/MsgUtil';
import * as DateUtil from 'src/utils/DateUtil';
import * as WidgetUtil from 'utils/WidgetUtil';
import businessRoute from 'business/route';
import NewSkuSpecifications from './skuform/NewSkuSpecifications';
import SkuDetail from './skuform/SkuDetail';
import config from './skuform/config';

export default class SkuForm extends React.Component {
	static propTypes={
		initState: PropTypes.object,
		toggleShow: PropTypes.func.isRequired,
		form: PropTypes.array.isRequired,
		add: PropTypes.func,
		detailData: PropTypes.array.isRequired,
		modifySkuHandler: PropTypes.func.isRequired,
		removeSkuHandler: PropTypes.func.isRequired,
	};
	static defaultProps={
		initState: {
			ifInit: false,
		},
		add: () => {
			console.log('add callback is not defined');
		},
	};
	constructor(props){
		super(props);
		const { initState } = this.props;
		this.state={
			...initState
		};
	}

	render(){
		const { toggleShow,form,add,detailData,modifySkuHandler,removeSkuHandler } = this.props;

		return (<Row>
			<Col span={2}>
				<p>库存/规格：</p>
			</Col>
			<Col span={22}>
				<Row>
					<Col span={2}>
						<p>商品规格：</p>
					</Col>
					<Col span={22}>
						<NewSkuSpecifications
							initState={{
								defaultValue: form
							}}
							form={form}
							add={add}
						/>
					</Col>
				</Row>
				<Row>
					<Col span={2}>
						<p>商品明细：</p>
						<p><b>请注意，此处表格的价格均使用元!</b></p>
					</Col>
					<Col span={22}>
						<SkuDetail
							add={toggleShow}
							form={form}
							data={detailData}
							modifySkuHandler={modifySkuHandler}
							removeSkuHandler={removeSkuHandler}
						/>
					</Col>
				</Row>
			</Col>
		</Row>);
	}
}