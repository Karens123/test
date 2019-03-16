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

export default class SkuSpecificationInput extends React.Component {
	static propTypes ={
		initState: PropTypes.object,
		callback: PropTypes.func,
		removeCb: PropTypes.func,
		index: PropTypes.number.isRequired,
	};
	static defaultProps = {
		initState: {
			defaultValue: 60,
		},
		callback: (nextState) => {
			console.log('callback is not defined',nextState);
		},
		removeCb: () => {
			console.log('remove callback is not defined');
		}
	};
	constructor(props){
		super(props);
		const { initState } =this.props;
		this.state={
			...initState,
		};
	}
	componentWillReceiveProps(nextProps){
		const { initState } = nextProps;
		this.setState({
			...initState,
		});
	}

	render(){
		const { defaultValue } = this.state;
		const { removeCb,index,callback } = this.props;
		return (<div className="sku-spes-input">
			<span
				className="sku-spes-btn-close" onClick={() => {
					removeCb(index);
				}}
			>x</span>
			<Input
				defaultValue={defaultValue}
				style={{ width: '80px' }}
				value={defaultValue}
				onChange={(e) => {
					callback(e.target.value,index);
				}}
			/>
		</div>);
	}
}