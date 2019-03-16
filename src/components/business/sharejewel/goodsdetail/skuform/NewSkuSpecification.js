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
import SkuSpecificationInput from './SkuSpecificationInput';
import { config } from './config';


export default class NewSkuSpecification extends React.Component {
	static propTypes ={
		initState: PropTypes.object,
		add: PropTypes.func,
	};
	static defaultProps = {
		initState: {
			val: ['undefined value'],
			key: 'undefined name',
		},
		add: () => {
			console.log('add callback is not defined');
		},
	};

	renderList = () => {
		const { initState } = this.props;
		const { val } = initState;
		const ret=[];
		const spanStyle={
			display: 'inline-block',
			padding: '0.5em',
			border: '1px solid #eee',
			textAlign: 'center',
			marginRight: '0.5em',
			cursor: 'default',
		};
		(val||[]).map((v,key) => {
			ret.push(
				<span style={spanStyle}>{v}</span>
			);
		});
		return ret;
	};

	render(){
		const { initState,add } = this.props;
		return (<Row>
			<div style={{ border: '1px solid #eee' }}>
				<Row>
					<Col span={2}>
						<p>规格名：</p>
					</Col>
					<Col span={22}>
						<p>{initState&&`${initState.key} ${initState.remark}`}</p>
					</Col>
				</Row>
				<br />
				<Row>
					<Col span={2}>
						<p>规格值：</p>
					</Col>
					<Col span={22}>
						{this.renderList()}
						<span
							className="ant-btn ant-btn-primary ant-btn-lg"
							onClick={() => {
								add(initState&&initState.key,initState&&initState.id);
							}}
						>+添加规格值</span>
					</Col>
				</Row>

			</div>
			<br />
		</Row>);
	}
}