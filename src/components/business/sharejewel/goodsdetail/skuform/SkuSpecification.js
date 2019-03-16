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


export default class SkuSpecification extends React.Component {
	static propTypes ={
		initState: PropTypes.object,
		callback: PropTypes.func,
		selected: PropTypes.array.isRequired,
		removeCb: PropTypes.func,
	};
	static defaultProps = {
		initState: {
			defaultValue: [60,90],
			key: 1,
		},
		callback: (nextState) => {
			console.log('callback is not defined',nextState);
		},
		removeCb: (i) => {
			console.log('removeCb is not defined',i);
		}
	};
	constructor(props){
		super(props);
		const { initState } =this.props;
		this.state={
			...initState,
		};
		// console.log('SkuSpecification',config);
	}
	componentWillReceiveProps(nextProps){
		const { initState } = nextProps;
		this.setState({
			...initState,
		});
	}

	selectChangeHandler = (selected) => {
		const { callback } = this.props;
		this.setState({
			key: selected,
		},() => {
			if (typeof callback === 'function'){
				const { value,defaultValue,key } = this.state;
				callback({
					value: value||defaultValue,
					key,
				});
			}
		});
	};

	add = () => {
		const { defaultValue,value } = this.state;
		console.log('addValue is called');
		this.setState({
			value: [...(value||defaultValue),''],
		},() => {
			const { callback } = this.props;
			if (typeof callback === 'function'){
				const { value,defaultValue,key } = this.state;
				callback({
					value: value||defaultValue,
					key,
				});
			}
		});
	};
	removeCallback = (index) => {
		const { value,defaultValue } = this.state;
		let newValue;
		if (value === undefined){
			newValue=[...defaultValue];
		} else {
			newValue=[...value];
		}
		newValue.splice(index,1);
		console.log('removeCallback',index,value,defaultValue,newValue);
		this.setState({
			value: newValue,
		},() => {
			const { callback } = this.props;
			if (typeof callback === 'function'){
				const { value,defaultValue,key } = this.state;
				callback({
					value: value||defaultValue,
					key,
				});
			}
		});
	};
	inputChangeHandler = (val,key) => {
		const { value,defaultValue } = this.state;
		let newValue;
		if (value === undefined){
			newValue=[...defaultValue];
		} else {
			newValue=[...value];
		}
		newValue[key]=val;
		this.setState({
			value: newValue,
		},() => {
			const { callback } = this.props;
			if (typeof callback === 'function'){
				const { value,defaultValue,key } = this.state;
				callback({
					value: value||defaultValue,
					key,
				});
			}
		});
	};
	renderList = () => {
		const { defaultValue,value } = this.state;
		const ret=[];
		// console.log('SkuSpecification renderList defaultValue',defaultValue,value);
		(value||defaultValue).map((val,key) => {
			ret.push(
				<SkuSpecificationInput
					initState={{
						defaultValue: val,
					}}
					removeCb={this.removeCallback}
					index={key}
					callback={this.inputChangeHandler}
				/>
			);
		});
		return ret;
	};
	renderSelect = (selected) => {
		// const Option = Select.Option;
		// // const { selected } = this.props;
		// const { key } = this.state;
		// // console.log('renderSelect',selected);
		// return (<Select defaultValue={key} style={{ width: 120 }} onChange={this.selectChangeHandler}>
		// 	{config.map((val) => {
		// 		// console.log('renderSelect in selected',val.index,!Array.indexOf(selected,val.index));
		// 		//Array.indexOf(selected,val.index)===-1,则说明未被选中，即可被选中，disabled应该为false；反之亦然
		// 		return <Option value={val.index} disabled={Array.indexOf(selected,val.index)!==-1} >{val.key}</Option>;
		// 	})}
		// </Select>);
	};
	render(){
		const { removeCb } = this.props;
		const { key } = this.state;
		const { selected } = this.props;

		return (<Row>
			<div className="default-relative">
				<span
					className="sku-spe-btn-close"
					onClick={() => {
						removeCb(key);
					}}
				>x</span>
				<Row>
					<Col span={2}>
						<p>规格名：</p>
					</Col>
					<Col span={22}>
						{this.renderSelect(selected)}
					</Col>
				</Row>
			</div>

			<Row>
				<Col span={2}>
					<p>规格值：</p>
				</Col>
				<Col span={22}>
					{this.renderList()}
					<span onClick={this.add}>+添加规格值</span>
				</Col>
			</Row>
		</Row>);
	}
}