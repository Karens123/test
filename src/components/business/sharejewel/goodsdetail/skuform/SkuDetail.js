'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Col, Row, Table, Tabs, Select, Pagination, Modal, Input, Form, InputNumber } from 'antd';
import { parseDate, parseDateTime } from 'utils/DateUtil';
import * as MsgUtil from 'utils/MsgUtil';
import * as DateUtil from 'src/utils/DateUtil';
import * as WidgetUtil from 'utils/WidgetUtil';
import businessRoute from 'business/route';
import Editor from 'business/sharejewel/widget/editor/Editor';


export default class SkuDetail extends React.Component {
	static propTypes = {
		form: PropTypes.array.isRequired,
		add: PropTypes.func.isRequired,
		data: PropTypes.array.isRequired,
		modifySkuHandler: PropTypes.func.isRequired,
		removeSkuHandler: PropTypes.func.isRequired,
	};
	constructor(props){
		super(props);
		this.state={
			ifInit: false,
		};
	}
	getColumnFromProp = () => {
		const { form } =this.props;
		const ret=[];
		if (Array.isArray(form)){
			form.forEach((val) => {
				ret.push({
					title: val.key,
					dataIndex: val.id,
					key: val.id,
				});
			});
		}
		console.log('getColumnFromProp',ret);
		return ret;
	};

	getColumns = () => {
		const columns=[
			{
				title: 'ERP编码',
				dataIndex: 'skuNo',
				key: 'skuNo',
			},
			...(this.getColumnFromProp()),
			{
				title: '原日租',
				dataIndex: 'dailyRents',
				key: 'dailyRents',
			},
			{
				title: '活动日租',
				dataIndex: 'discountRents',
				key: 'discountRents',
			},
			{
				//商品出售指导价
				title: '商品原价',
				dataIndex: 'goodsSalePrice',
				key: 'goodsSalePrice',
			},
			{
				//sku售价(租金)
				title: '原租金',
				dataIndex: 'salePrice',
				key: 'salePrice',
			},
			{
				//sku折扣价(实际租金)
				title: '活动租金',
				dataIndex: 'discountPrice',
				key: 'discountPrice',
			},
			{
				title: '库存',
				dataIndex: 'stock',
				key: 'stock',
			},
			{
				title: '操作',
				dataIndex: 'actions',
				key: 'actions',
			},
		];
		return columns;
	};

	getDataFromProps = (skuProperties='') => {
		const ret={};
		const mutableSkuPropertiesObj=this.decodeSkuProperties(skuProperties);
		// console.log('getDataFromProps mutableSkuPropertiesObj',mutableSkuPropertiesObj);
		for (const key in mutableSkuPropertiesObj){
			ret[key]=mutableSkuPropertiesObj[key];
		}
		console.log('getColumnFromProp',ret);
		return ret;
	};
	getData = () => {
		const { data,modifySkuHandler,removeSkuHandler } = this.props;
		const ret=[];
		if (Array.isArray(data)){
			data.forEach((val) => {
				console.log('getData...',val);
				// console.log('getData...',{ ...(this.getDataFromProps(val&&val.skuProperties)) });
				const ifmodify=this.state[`ifModifySku-${val.skuId}`];
				ret.push({
					skuNo: <Input
						key={`sku-${val.skuId}-skuNo`}
						defaultValue={val.skuNo}
						// value={WidgetUtil.getTrueCost(val.dailyRents)}
						onChange={(value) => {
							console.log(value);
							this.setState({
								[`ifModifySku-${val.skuId}`]: true,
								[`sku-${val.skuId}-skuNo`]: value.target.value
							});
						}}
					/>,
					...(this.getDataFromProps(val&&val.skuProperties)),
					dailyRents: <InputNumber
						defaultValue={WidgetUtil.getTrueCost(val.dailyRents)}
						// value={WidgetUtil.getTrueCost(val.dailyRents)}
						key={`sku-${val.skuId}-dailyRents`}
						onChange={(value) => {
							console.log(value);
							this.setState({
								[`ifModifySku-${val.skuId}`]: true,
								[`sku-${val.skuId}-dailyRents`]: (value*100).toFixed(0)
							});
						}}
						min={0}
						step={0.01}
						precision={2}
					/>,
					discountRents: <InputNumber
						defaultValue={WidgetUtil.getTrueCost(val.discountRents)}
						// value={WidgetUtil.getTrueCost(val.dailyRents)}
						key={`sku-${val.skuId}-discountRents`}
						onChange={(value) => {
							console.log(value);
							this.setState({
								[`ifModifySku-${val.skuId}`]: true,
								[`sku-${val.skuId}-discountRents`]: (value*100).toFixed(0)
							});
						}}
						min={0}
						step={0.01}
						precision={2}
					/>,
					goodsSalePrice: <InputNumber
						defaultValue={WidgetUtil.getTrueCost(val.goodsSalePrice)}
						// value={WidgetUtil.getTrueCost(val.dailyRents)}
						key={`sku-${val.skuId}-goodsSalePrice`}
						onChange={(value) => {
							console.log(value);
							this.setState({
								[`ifModifySku-${val.skuId}`]: true,
								[`sku-${val.skuId}-goodsSalePrice`]: (value*100).toFixed(0)
							});
						}}
						min={0}
						step={0.01}
						precision={2}
					/> ,
					salePrice: <InputNumber
						defaultValue={WidgetUtil.getTrueCost(val.salePrice)}
						// value={WidgetUtil.getTrueCost(val.dailyRents)}
						key={`sku-${val.skuId}-salePrice`}
						onChange={(value) => {
							console.log(value);
							this.setState({
								[`ifModifySku-${val.skuId}`]: true,
								[`sku-${val.skuId}-salePrice`]: (value*100).toFixed(0)
							});
						}}
						min={0}
						step={0.01}
						precision={2}
					/>,
					discountPrice: <InputNumber
						defaultValue={WidgetUtil.getTrueCost(val.discountPrice)}
						// value={WidgetUtil.getTrueCost(val.dailyRents)}
						key={`sku-${val.skuId}-discountPrice`}
						onChange={(value) => {
							console.log(value);
							this.setState({
								[`ifModifySku-${val.skuId}`]: true,
								[`sku-${val.skuId}-discountPrice`]: (value*100).toFixed(0)
							});
						}}
						min={0}
						step={0.01}
						precision={2}
					/> ,
					stock: <InputNumber
						defaultValue={val.stock}
						// value={WidgetUtil.getTrueCost(val.dailyRents)}
						key={`sku-${val.skuId}-stock`}
						onChange={(value) => {
							console.log(value);
							this.setState({
								[`ifModifySku-${val.skuId}`]: true,
								[`sku-${val.skuId}-stock`]: value,
							});
						}}
						min={0}
						step={1}
						precision={0}
					/> ,
					actions: (<div>
						{ifmodify?
							<div
								className="ant-btn ant-btn-info ant-btn-lg"
								onClick={(e) => {
									console.log('修改');
									this.setState({
										[`ifModifySku-${val.skuId}`]: false
									});
									const record=this.getSkuModifyData(val.skuId);
									modifySkuHandler(record);
								}}
							>修改</div>:null}
						<div
							className="ant-btn ant-btn-primary ant-btn-lg"
							onClick={(e) => {
								removeSkuHandler(val.skuId);
							}}
						>删除</div>
					</div>),
				});
			});
		}
		console.log('getData',ret);
		return ret;
	};
	getSkuModifyData = (skuId) => {
		const ret = {};
		const parseExclude=['skuNo'];
		for (const key in this.state){
			const reg=new RegExp(`sku-${skuId}-(.*)`);
			const match=key.match(reg);
			if (match){
				// console.log('getSkuModifyData data',match);
				const isExclude=parseExclude.includes(match[1]);
				ret[match[1]]= isExclude?this.state[key]:parseInt(this.state[key]);
			}
		}
		if (Object.keys(ret).length){
			ret['skuId']=skuId;
		}
		console.log('getSkuModifyData',ret);
		return ret;
	};
	decodeSkuProperties = (skuProperties) => {
		const ret={};
		// console.log('decodeSkuProperties',skuProperties);
		const kvArr=skuProperties.split(';');
		// console.log('decodeSkuProperties',kvArr);
		kvArr.forEach((val) => {
			const match = val.match(/([0-9a-zA-Z]*):(.*)/);
			if (Array.isArray(match)){
				const k = match[1];
				const v = match[2];
				// console.log('kvArr',match);
				ret[k]=v;
			}
		});
		console.log('decodeSkuProperties',ret);

		return ret;
	};
	render(){
		const { data,add } = this.props;
		const columns=this.getColumns();
		console.log('SkuDetail',columns);
		const dataSource=this.getData();
		return (<div>
			<Table dataSource={dataSource} columns={columns} pagination={false} />
			<div className="ant-btn ant-btn-primary ant-btn-lg" onClick={add}>+添加</div>
		</div>);
	}
}