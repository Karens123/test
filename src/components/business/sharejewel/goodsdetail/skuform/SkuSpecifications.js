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
import SkuSpecification from './SkuSpecification';
import { config } from './config';
import './index.less';

export default class SkuSpecifications extends React.Component {
	static propTypes ={
		initState: PropTypes.object,
		callback: PropTypes.func,
		removeCb: PropTypes.func,
	};
	static defaultProps = {
		initState: {
			defaultValue: [{
				key: 1,
				vals: [60,90]
			}]
		},
		callback: (nextState) => {
			console.log('callback is not defined',nextState);
		},
		removeCb: (key) => {
			console.log('callback is not defined',key);
		}
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
		// this.setState({
		// 	value: [...this.state.defaultValue],
		// });
	}

	componentWillReceiveProps(nextProps){
		console.log('ss receive props',nextProps);
	}

	getSelected = () => {
		const ret = [];
		const { defaultValue,value } = this.state;
		const trueValue = value||defaultValue;
		console.log('getSelected',defaultValue);
		trueValue.map((val) => {
			ret.push(val.key);
		});
		return ret;
	};
	getKey = (keys,stateKeys) => {
		let key;
		console.log('getKey',keys,stateKeys);
		for (let i=0,len=keys.length;i<len;i++){
			if (Array.indexOf(stateKeys,keys[i])===-1){
				console.log('getKey',keys[i],stateKeys);
				key=keys[i];
				break;
			}
		}
		console.log('getKey',key);
		return key;
	};
	getKeys = () => {
		const ret=[];
		config.forEach((val) => {
			ret.push(val.index);
		});
		return ret;
	};
	getStateKeys = (stateValue) => {
		const ret = [];
		stateValue.forEach((val) => {
			ret.push(val.key);
		});
		return ret;
	};
	getConfig = (key) => {
		let ret;
		config.forEach((val) => {
			if (val.index==key){
				ret = val;
			}
		});
		return ret||{};
	};

	getNewItem = (oldValue) => {
		console.log('getNewItem',oldValue,config);
		let newKey;
		let newVals;
		const keys = this.getKeys();
		console.log('getNewItem',keys);
		const stateKeys = this.getStateKeys(oldValue);

		const key = this.getKey(keys,stateKeys);
		const newConfig = this.getConfig(key);
		return {
			key: newConfig.index,
			vals: newConfig.value,
		};
	};
	handleChange = (obj) => {
		const { value,defaultValue } = this.state;
		console.log('SkuSpecifications handleChange',obj,this.state);
		const oldValue = value||defaultValue;
		const newValue = [];
		const { callback } = this.props;
		if (typeof callback === 'function'){
			callback(this.state);
		}
	};
	add = () => {
		const { defaultValue,value } = this.state;
		console.log('add is called');
		const oldValue = value||defaultValue;
		if (oldValue.length>=config.length){
			MsgUtil.showwarning('规格属性已达上限，无法继续增加');
		} else {
			const newItem = this.getNewItem(oldValue);
			const newValue = [...oldValue,newItem];
			console.log(newValue);
			// debugger;
			this.setState({
				value: newValue,
			},() => {
				const { callback }= this.props;
				if (typeof callback === 'function'){
					callback(this.state);
				}
			});
		}
	};

	removeHandler = (key) => {
		console.log('removeHandler',key);
		const { value,defaultValue } =this.state;
		const newValue=[];
		const oldValue=value||defaultValue;
		if (oldValue.length<=1){
			MsgUtil.showwarning('只剩一条选项，不能再删除了！');
		} else {
			oldValue.forEach((val) => {
				if (val.key!=key){
					newValue.push(val);
				} else {
					console.log('item found',key,val);
				}
			});
			this.setState({
				value: newValue,
			},() => {
				console.log('removeHandler',this.state);
				const { callback } = this.props;
				if (typeof callback === 'function'){
					callback(this.state);
				}
			});
		}

	};

	renderList = () => {
		const { defaultValue,value } = this.state;
		const ret=[];
		const { removeCb } =this.props;
		// console.log('SkuSpecifications renderList defaultValue',defaultValue);
		const selected=this.getSelected();
		(value||defaultValue).map((val,key) => {
			ret.push(
				<SkuSpecification
					initState={{
						defaultValue: val.vals,
						key: val.key,
					}}
					selected={selected}
					callback={this.handleChange}
					removeCb={this.removeHandler}
					key={key}
				/>
			);
		});
		return ret;
	};


	render(){
		return (<div className="sku-spes">
			<Row>
				{this.renderList()}
				<span onClick={this.add}>添加规格项目</span>
			</Row>
		</div>);
	}
}