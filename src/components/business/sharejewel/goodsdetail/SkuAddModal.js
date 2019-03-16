'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Col, Row, Table, Tabs, Select, Pagination, Modal, Input, InputNumber , Radio } from 'antd';
import { parseDate, parseDateTime } from 'utils/DateUtil';
import * as MsgUtil from 'utils/MsgUtil';
import * as DateUtil from 'src/utils/DateUtil';
import * as WidgetUtil from 'utils/WidgetUtil';


export default class SkuAddModal extends React.Component {
	static propTypes ={
		addCb: PropTypes.func,
		isShow: PropTypes.bool.isRequired,
		toggleShow: PropTypes.func.isRequired,
		form: PropTypes.array.isRequired,
		goodsId: PropTypes.number.isRequired,
	};
	static defaultProps = {
		addCb: () => {
			console.log('remove callback is not defined');
		}
	};
	constructor(props){
		super(props);
		this.state={
			ifInit: false,
		};
	}
	componentWillReceiveProps(nextProps){

	}
	getSkuProperties = () => {
		const ret=[];
		for (const key in this.state){
			if (key.match(/^skuPropId/)){
				// console.log(this.state[key],key);
				ret.push(`${key.slice('skuPropId-'.length)}:${this.state[key]}`);
			}
		}
		console.log('getSkuProperties',ret.join(';'));
		return ret.join(';');
	};
	changeHandler = (val,key,opt={ isCost: false }) => {
		console.log('file',val.target?val.target.value:val,key);
		const tarVal=val.target?val.target.value:val;
		const newVal = opt.isCost?(tarVal*100).toFixed(0):tarVal;
		this.setState({
			[key]: newVal,
		});
	};
	addHandler = (e) => {
		const { addCb,goodsId,toggleShow } = this.props;
		const {
			skuProperties,
			goodsSalePrice,
			salePrice,
			discountPrice,
			dailyRents,
			discountRents,
			stock,
			skuNo
		} = this.state;
		addCb({
			goodsId,
			skuProperties: this.getSkuProperties(),
			salePrice: parseInt(salePrice),
			discountPrice: parseInt(discountPrice),
			dailyRents: parseInt(dailyRents),
			discountRents: parseInt(discountRents),
			goodsSalePrice: parseInt(goodsSalePrice),
			stock,
			skuNo
		});
		toggleShow(e);
	};
	hideHandler=(e) => {
		const { toggleShow, } = this.props;
		const newState={};
		for (const key in this.state){
			if (key.match(/^skuPropId/)){
				newState[key]='';
			}
		}
		console.log('newState',newState);
		this.setState(newState);
		toggleShow(e);
	};
	renderOpts = (opts) => {
		const ret=[];
		const RadioButton = Radio.Button;
		opts.map((val) => {
			ret.push(<RadioButton value={val}>{val}</RadioButton>);
		});
		return ret;
	};
	renderForm = (form) => {
		const ret=[];
		const RadioGroup = Radio.Group;

		form.map((val,key) => {
			// console.log(this.state[`skuPropId-${val.id}`]);
			ret.push(<Row>
				<Col span={4}>
					选择{val.key}<span className="red">*</span>
				</Col>
				<Col span={20}>
					<RadioGroup
						// defaultValue={val.val[0]}
						onChange={(e) => {
							this.changeHandler(e,`skuPropId-${val.id}`);
						}}
						value={this.state[`skuPropId-${val.id}`]}
					>
						{this.renderOpts(val.val)}
					</RadioGroup>
				</Col>
			</Row>);
		});
		return ret;
	};

	render(){
		const { form } = this.props;
		const { isShow,toggleShow, } = this.props;
		return (<Modal
			title="新商品规格"
			visible={isShow}
			onOk={toggleShow}
			onCancel={this.hideHandler}
			footer={null}
			width={1280}
		>
			{/*{JSON.stringify(this.state)}*/}
			<div>添加规格</div>
			{this.renderForm(form)}
			<div>添加明细 <b>请注意，此处表格的价格均使用元!</b></div>
			<Row>
				<Col span={8}>
					原日租：<span className="red">*</span>
					<div style={{ width: '80px',display: 'inline-block' }} >
						<InputNumber precision={2} onChange={(val) => { this.changeHandler(val,'dailyRents',{ isCost: true }); }} />
					</div>
				</Col>
				<Col span={8}>
					活动日租：<span className="red">*</span>
					<div style={{ width: '80px',display: 'inline-block' }} >
						<InputNumber precision={2} onChange={(val) => { this.changeHandler(val,'discountRents',{ isCost: true }); }} />
					</div>
				</Col>
				<Col span={8}>
					{/*商品出售指导价*/}
					商品原价：<span className="red">*</span>
					<div style={{ width: '80px',display: 'inline-block' }} >
						<InputNumber precision={2} onChange={(val) => { this.changeHandler(val,'goodsSalePrice',{ isCost: true }); }} />
					</div>
				</Col>

			</Row>
			<br />
			<Row>
				<Col span={8}>
					{/*sku售价(租金)*/}
					原租金：<span className="red">*</span>
					<div style={{ width: '80px',display: 'inline-block' }} >
						<InputNumber precision={2} onChange={(val) => { this.changeHandler(val,'salePrice',{ isCost: true }); }} />
					</div>
				</Col>
				<Col span={8}>
					{/*sku折扣价(实际租金)*/}
					活动租金：<span className="red">*</span>
					<div style={{ width: '80px',display: 'inline-block' }} >
						<InputNumber precision={2} onChange={(val) => { this.changeHandler(val,'discountPrice',{ isCost: true }); }} />
					</div>
				</Col>
				<Col span={8}>
					库存：<span className="red">*</span>
					<div style={{ width: '80px',display: 'inline-block' }} >
						<InputNumber precision={0} onChange={(val) => { this.changeHandler(val,'stock'); }} />
					</div>
				</Col>
			</Row>
			<br />
			<Row>
				<Col span={8}>
					{/*skuNo*/}
					ERP编码：<span className="red">*</span>
					<div style={{ width: '80px',display: 'inline-block' }} >
						<Input onChange={(val) => { this.changeHandler(val,'skuNo'); }} />
					</div>
				</Col>
			</Row>
			<br />
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<button onClick={this.hideHandler} className="ant-btn ant-btn-lg">取消</button>&nbsp;&nbsp;&nbsp;
				<button onClick={this.addHandler} className="ant-btn ant-btn-primary ant-btn-lg">确认添加</button>
			</div>
		</Modal>);
	}

}