'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Col, Row, Table, Tabs, Select, Pagination, Modal, Input, Form, Radio,InputNumber } from 'antd';
import { parseDate, parseDateTime } from 'utils/DateUtil';
import * as MsgUtil from 'utils/MsgUtil';
import * as DateUtil from 'src/utils/DateUtil';
import * as WidgetUtil from 'utils/WidgetUtil';
import businessRoute from 'business/route';
import ImgUpload from 'business/sharejewel/goodsdetail/baseinfo/ImgUpload';
import NewSkuSpecifications from './skuform/NewSkuSpecifications';


export default class BaseInfo extends React.Component {
	static propTypes ={
		initState: PropTypes.object,
		callback: PropTypes.func,
		skuGroupData: PropTypes.array,
		skuChangeHandler: PropTypes.func.isRequired,
		isAdd: PropTypes.bool.isRequired,
		goodsId: PropTypes.number.isRequired,
		skuPropForm: PropTypes.object.isRequired,
		addHandler: PropTypes.func.isRequired,
	};
	static defaultProps = {
		initState: {
			productType: '1',
			goodsName: '',
			goodsTitle: '',
			goodsSubTitle: '',
			goodsNo: '',
			dailyRents: 0,
			discountRents: 0,
			salePrice: 0,
			discountPrice: 0,
			goodsPicBeanList: [],
			advertisePicList: [],
		},
		skuGroupData: [
			{
				skuGroupId: 1,
				groupName: '查询中',
				state: 1,
			},
			{
				skuGroupId: 2,
				groupName: '隐藏的',
				state: 0,
			},
		],
		callback: (nextState) => {
			// console.log('callback is not defined',nextState);
		}
	};
	constructor(props){
		super(props);
		const { initState } =this.props;
		this.state={
			...initState,
			goodsPicBeanList: [],
		};
	}
	componentWillReceiveProps(nextProps){
		const { initState } = nextProps;
		this.setState({
			...initState,
		});
	}
	getNewImgInfo = (fileList) => {
		console.log('getNewImgInfo',fileList[fileList.length-1]);
		const { goodsId } = this.props;
		const file=fileList[fileList.length-1];
		const ret={
			image: file.path,
			url: file.url,
			goodsId,
			state: 1,
		};
		console.log('getNewImgInfo ret',ret);
		return ret;
	};
	handleImgChange = (imgInfo) => {
		console.log('handleImgChange',imgInfo);
		const { fileList } = imgInfo;

		const newItem=this.getNewImgInfo(fileList);
		const { goodsPicBeanList } = this.state;
		console.log('testing 3',goodsPicBeanList);
		if (newItem.image){
			if (goodsPicBeanList){
				this.setState({
					goodsPicBeanList: [...goodsPicBeanList,newItem]
				},() => {
					const { callback } = this.props;
					if (typeof callback === 'function'){
						callback(this.state);
					}
				});
			} else {
				this.setState({
					goodsPicBeanList: [newItem]
				},() => {
					const { callback } = this.props;
					if (typeof callback === 'function'){
						callback(this.state);
					}
				});
			}
		}
	};
	handleAdvertisePicListChange = (imgInfo) => {
		console.log('handleAdvertisePicListChange',imgInfo);
		const { fileList } = imgInfo;

		const newItem=this.getNewImgInfo(fileList);
		if (newItem.image){
			this.setState({
				advertisePicList: [newItem]
			},() => {
				console.log('handleAdvertisePicListChange',this.state.advertisePicList);
				const { callback } = this.props;
				if (typeof callback === 'function'){
					callback(this.state);
				}
			});
		}
	};
	handleChange = (stateId,isCost) => {
		const { callback } = this.props;
		return (val) => {
			console.log('handleChange',val);
			this.setState({
				[stateId]: val.target? (val.target.value):val,
			},() => {
				if (typeof callback === 'function'){
					callback(this.state);
				}
			});
		};
	};

	render(){
		const Option = Select.Option;
		const { productType,skuGroupId,skuGroupName } =this.state;
		const RadioButton = Radio.Button;
		const RadioGroup = Radio.Group;
		const { skuGroupData,skuChangeHandler,isAdd,skuPropForm,addHandler } = this.props;
		const data = [
			{
				label: '商品名称：',
				placeholder: '商品名称',
				stateKey: 'goodsName',
			},
			{
				label: '商品标题：',
				placeholder: '商品标题',
				stateKey: 'goodsTitle',
			},
			{
				label: '商品副标题：',
				placeholder: '商品副标题',
				stateKey: 'goodsSubTitle',
			},
			{
				label: '商品码：',
				placeholder: '商品码',
				stateKey: 'goodsNo',
			},
			{
				label: '原日租金：',
				placeholder: '原日租金',
				stateKey: 'dailyRents',
				isCost: true,
			},
			{
				label: '折扣日租金：',
				placeholder: '折扣日租金',
				stateKey: 'discountRents',
				isCost: true,
			},
			{
				label: '原价：',
				placeholder: '原价',
				stateKey: 'salePrice',
				isCost: true,
			},
			{
				label: '折扣价：',
				placeholder: '折扣价',
				stateKey: 'discountPrice',
				isCost: true,
			},
		];
		return (<Row>
			<Col span={2}>
				<p className="text-center">基本信息</p>
			</Col>
			<Col span={22}>
				<Row>
					<Col span={2}>
						<p>商品分类：</p>
					</Col>
					<Col span={22}>
						<Select
							value={productType&&productType.toString()}
							style={{ width: 120 }}
							onChange={this.handleChange('productType')}
						>
							<Option value="1">戒指</Option>
							{/*<Option value="2">手串</Option>*/}
							<Option value="3">项链</Option>
							<Option value="4">手链</Option>
							<Option value="5">手镯</Option>
						</Select>
					</Col>
				</Row>
				<br />
				{data.map((val) => {
					const defVal = this.state[val.stateKey];
					return (<div>
						<Row>
							<Col span={2}>
								<p>{val.label}</p>
							</Col>
							<Col span={22}>
								<div style={{ width: '200px',display: 'inline-block' }}>
									{val.isCost?
										<InputNumber
											value={val.isCost?((defVal||0)):defVal}
											precision={0}
											onChange={this.handleChange(val.stateKey,val.isCost)}
										/>
										:<Input
											placeholder={val.placeholder}
											onChange={this.handleChange(val.stateKey,val.isCost)}
											defaultValue={val.isCost?((defVal||0)):defVal}
											value={val.isCost?((defVal||0)):defVal}
										/>
									}
									{val.isCost? <span><b>单位：分，外部展示用</b> <span className="red">{((val.isCost?((defVal||0)):defVal)/100).toFixed(2)}元</span></span>:null}
								</div>

							</Col>
						</Row>
						<br />
					</div>);
				})}
				<Row>
					<Col span={2}>
						<p>规格分组：</p>
					</Col>
					<Col span={22}>
						{
							isAdd?
								(<div>
									<div>
										<RadioGroup
											// defaultValue={skuGroupData&&skuGroupData[0]&&skuGroupData[0].skuGroupId}
											onChange={skuChangeHandler}
											size={(skuGroupData&&skuGroupData.length>10)?'small':'default'}
											value={skuGroupId}
										>
											{skuGroupData&&skuGroupData.map((val) => {
												if (val.state!=0){
													return (<RadioButton value={val.skuGroupId}>{val.groupName}</RadioButton>);
												} else {
													return null;
												}
											})}
										</RadioGroup>
									</div>
									<br />
									<NewSkuSpecifications
										initState={{
											defaultValue: skuPropForm
										}}
										form={skuPropForm}
										add={addHandler}
									/>
								</div>):
								skuGroupName
						}
					</Col>
				</Row>
				<br />
				<Row>
					<Col span={2}>
						<p>产品图：</p>
					</Col>
					<Col span={22}>
						<div>
							<ImgUpload
								callback={this.handleImgChange}
								list={this.state.goodsPicBeanList}
							/>
						</div>
						<br />
						<p>建议尺寸：800*800像素，png格式的透明产品图</p>
						<br />
					</Col>
				</Row>
				<Row>
					<Col span={2}>
						<p>宣传图：</p>
					</Col>
					<Col span={22}>
						<div>
							<ImgUpload
								callback={this.handleAdvertisePicListChange}
								list={this.state.advertisePicList}
								isSingle
							/>
						</div>
						<br />
						<p>建议尺寸：800*800像素，png格式的透明产品图</p>
						<br />
					</Col>
				</Row>
			</Col>
		</Row>);
	}
}