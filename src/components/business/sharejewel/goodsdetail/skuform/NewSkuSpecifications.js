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
import NewSkuSpecification from './NewSkuSpecification';
import { config } from './config';
import './index.less';

export default class NewSkuSpecifications extends React.Component {
	static propTypes ={
		initState: PropTypes.object,
		form: PropTypes.object.isRequired,
		add: PropTypes.func,
	};
	static defaultProps = {
		initState: {
			defaultValue: [{
				key: 1,
				val: [60,90]
			}]
		},
		add: () => {
			console.log('add callback is not defined');
		},
	};
	constructor(props){
		super(props);
		const { initState } =this.props;
		this.state={
			...initState,
		};
		console.log(config);
	}
	componentDidMount(){

	}

	componentWillReceiveProps(nextProps){
		console.log('ss receive props',nextProps);
	}

	renderList = (arr) => {
		// def arrItem = {
		// 	val: [string],
		// 	key: string,
		// }
		const { add }=this.props;
		const ret=[];
		arr.map((val) => {
			ret.push(<NewSkuSpecification
				initState={val}
				add={add}
			/>);
		});
		return ret;
	};



	render(){
		const { form } = this.props;
		// const testingData = [{
		// 	key: '尺寸',
		// 	val: [13,14]
		// },];
		return (<div className="sku-spes">
			<Row>
				{this.renderList(form)}
			</Row>
		</div>);
	}
}