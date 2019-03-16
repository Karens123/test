'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Col, Row, Table, Tabs, Select, Pagination, Modal, Input, Form, Icon,Button } from 'antd';
import { parseDate, parseDateTime } from 'utils/DateUtil';
import OrderStep from 'business/sharejewel/widget/orderstep';
import * as MsgUtil from 'utils/MsgUtil';
import * as DateUtil from 'src/utils/DateUtil';
import * as WidgetUtil from 'utils/WidgetUtil';
import * as MappingUtil from 'utils/MappingUtil';

import businessRoute from 'business/route';
import Editor from 'business/sharejewel/widget/editor/Editor';
import ShareJewelOrderAll from './ShareJewelOrderAll';
import ShareJewelOrderOnGoing from './ShareJewelOrderOnGoing';
import ShareJewelOrderReturning from './ShareJewelOrderReturning';
import ShareJewelOrderDone from './ShareJewelOrderDone';
import * as config from './config.json';
import { qryShareJewelOrders,qryShareJewelOrdersRenting } from './action';
import './index.less';


class ShareJewelOrderAdmin extends React.Component {
	//检验类型
	static contextTypes = {

	};

	static propTypes = {
		params: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		orderList: PropTypes.object,
	};

	static defaultProps = {
		orderList: {},
	};

	constructor (props) {
		super(props);
		this.state = {
			showDataType: this.props.params.tableType,
			filter: this.props.params.filter,
			currentPage: parseInt(this.props.params.page),
			goodIdValue: '',
			mobile: ''
		};
	}

	componentWillMount () {

	}
	componentDidMount (){
		console.log('component did mount');
		this.qryTable();
	}

	componentWillReceiveProps(nextProps) {
		const { orderList } = nextProps;
		this.setState({
			currentPage: orderList.currentPage,
			total: orderList.totalCount,
			orderList: orderList.records,
		});


		if (nextProps.params.type!==this.props.params.type){
			console.log('type is changed');
			this.setState({
				showDataType: config.defaultShowDataType,
				filter: config.filter.default.val,
				currentPage: 1,
			},() => {
				this.qryTable();
			});
		}


		if (nextProps.params.tableType!==this.props.params.tableType){
			this.setState({
				showDataType: nextProps.params.tableType
			},() => {
				this.qryTable();
			});
		}



		if (nextProps.params.filter!==this.props.params.filter){
			this.setState({
				filter: nextProps.params.filter
			},() => {
				this.qryTable();
			});
		}
		if (nextProps.params.page!==this.props.params.page){
			this.setState({
				currentPage: nextProps.params.page
			},() => {
				this.qryTable();
			});
		}

	};
	getQryRentingType = (type) => {
		switch (type){
			case '1':{
				return undefined;
			}
			case '2':{
				return 0;
			}
			case '3':{
				return 1;
			}
			default:{
				throw Error('unsupported-type');
			}
		}
	};
	getQryStates = (showDataType,type) => {
		//  订单状态： 0-取消/交易关闭 1-已创建/待付款 2-已付款/待确认 3-已确认/待发货 4-已发货/待收货
		//  5-已收货/待归还 6-已归还/待验收 7-已验收/待赔偿 8-已验收/结束 9; //已收货/待用户确认（购买时）
		// 10; //已确认/结束（购买时）  11; //已确认付款/待自提 12; //已取消/待退款 13; //退款审核通过/退款中
		//14; //已退款/结束
		switch (type) {
			case config.ALL:{
				switch (showDataType){
					case '1':{
						const arr=[];
						for (let i=0;i<=14;i++){
							arr.push(i);
						}
						return arr;
					}
					case '2':{
						return [2,3];
					}

					case '3':{
						return [12];
					}
					// case '4':{
					// 	return [8];
					// }
					default:{
						throw Error('unsupported-type');
					}
				}
			}
			case config.ONGOING:{
				switch (showDataType){
					case '1':{
						return [5];
					}
					default:{
						throw Error('unsupported-type');
					}
				}
			}
			case config.DONE:{
				switch (showDataType){
					case '1':{
						return [8];
					}
					default:{
						throw Error('unsupported-type');
					}
				}
			}
			case config.RETURNING:{
				switch (showDataType){
					case '1':{
						return [6,7];
					}
					default:{
						throw Error('unsupported-type');
					}
				}
			}
		}
	};
	getQryCreditType = (filter) => {
		switch (filter){
			case config.filter.all.val:{
				return config.filter.all.code;
			}
			case config.filter.zmxy.val:{
				return config.filter.zmxy.code;
			}
			case config.filter.deposit.val:{
				return config.filter.deposit.code;
			}
			case config.filter.menber.val:{
				return config.filter.menber.code;
			}
			default: {
				return undefined;
			}
		}
	};
	getGoodsTitle = (orderItemList=[]) => {
		const ret=[];
		orderItemList.map((val) => {
			ret.push(<Row>
				<Col span={4}><img src={val.advertisePic} alt="" style={{ width: '50px' }} /></Col>
				<Col span={20}>
					<Row>{val.goodsTitle}-{val.goodsSubTitle}</Row>
					<Row>{val.remark}</Row>
				</Col>
			</Row>);
		});
		return ret;
	};
	getAuthType = (type) => {
		const creditType = config.creditType;
		switch (type){
			case creditType.zmxy.code:{
				return creditType.zmxy.text;
			}
			case creditType.deposit.code:{
				return creditType.deposit.text;
			}
			case creditType.member.code:{
				return creditType.member.text;
			}
			default:{
				return '未定义值';
			}
		}
	};
	getOrderTime = (time,type,otherTime) => {
		const ret=[];
		ret.push(<Row>{DateUtil.parseDate(time)}</Row>);
		if (type!==config.ALL){
			ret.push(<Row>{DateUtil.parseDate(otherTime)}</Row>);
		} else {
			ret.push(<Row>{DateUtil.parseDateTime2(time)}</Row>);
		}

		return ret;
	};
	getLogisticsMode= (logisticsMode) => {
		switch (logisticsMode){
			case 0: {
				return '不发货';
			}
			case 1: {
				return '物流邮寄';
			}
			case 2: {
				return '自提点自提';
			}
			default:{
				return logisticsMode;
			}
		}
	};


	//控制查询
	qryTable = () => {
		const { actions } = this.props;
		const { showDataType, filter,currentPage,goodIdValue,mobile } = this.state;
		const { params } = this.props;
		const { type } = params;
		let record=undefined;
		if ( goodIdValue.length > 0 || mobile.length > 0) {
			record = this.renderArgument(goodIdValue,mobile);
		}

		switch (type) {
			case config.ALL:
			case config.DONE:
			case config.RETURNING: {
				actions.qryShareJewelOrders({
					currentPage,
					record: {
						states: this.getQryStates(showDataType,type),
						creditType: this.getQryCreditType(filter),
						...record
					}

				});
				break;
			}
			case config.ONGOING: {
				switch (showDataType){
					case '1':{
						actions.qryShareJewelOrders({
							currentPage,
							record: {
								states: this.getQryStates(showDataType,type),
								creditType: this.getQryCreditType(filter),
								argument
							}
						});
						break;
					}
					default: {
						actions.qryShareJewelOrdersRenting({
							currentPage,
							record: {
								creditType: this.getQryCreditType(filter),
								rentingType: this.getQryRentingType(showDataType),
								argument
							}
						});
					}
				}

			}
			default:
				break;
		}
	};

	//切换列表的控制
	showDataTypeHandler = (tableType) => {
		console.log('statusSelector');
		const { params } =this.props;
		const { type,filter,page } = params;
		console.log(page,type,tableType);
		this.setState({
			showDataType: tableType,
			currentPage: 1,
			// filter: config.filter.default.val,
		},() => {
			this.qryTable();
		});
		// window.location.replace(`${businessRoute.orderAdmin}/${type}/${tableType}/${page}/${filter}`);
	};

	//状态筛选
	statusSelector = (filter) => {
		console.log('statusSelector');
		const { params } =this.props;
		const { type,tableType,page } = params;
		const { showDataType } =this.state;
		console.log(page,type,tableType);
		this.setState({
			filter,
			currentPage: 1,
		},() => {
			this.qryTable();
		});
		// window.location.href=`${businessRoute.orderAdmin}/${type}/${showDataType}/${page}/${filter}`;
	};
	//分页控制
	paginationController = (page) => {
		const { params } =this.props;
		const { type,tableType,filter } = params;
		console.log(page,type,tableType);
		const { showDataType } =this.state;
		this.setState({
			currentPage: page,
		},() => {
			console.log('before qry',this.state.currentPage);
			this.qryTable();
		});
		// window.location.href=`${businessRoute.orderAdmin}/${type}/${showDataType}/${page}/${filter}`;
	};

	dataSerialize = (type,rawData) => {
		const ret=[];
		const { showDataType,
			filter,
			currentPage } = this.state;
		switch (type){
			case config.ALL:{
				console.log('here we go',`${businessRoute.orderAdmin}/${config.ALL}/${showDataType}/${currentPage}/${filter}`);
				rawData.forEach((data) => {
					ret.push({
						orderNo: data.orderId,
						title: this.getGoodsTitle(data.orderItemList),
						// discountDailyRent: data.discountPrice,
						orderTime: this.getOrderTime(data.createTime,type,data.dueReturnTime),
						authType: this.getAuthType(data.creditType),
						logisticsMode: this.getLogisticsMode(data.logisticsMode),
						realPay: WidgetUtil.getTrueCost(data.dueAmount),
						orderState: MappingUtil.shareJewelOrderTypeNumToPreText(data.state),
						actions: (<Link
							to={`${businessRoute.OrderAdminDetail}/${data.orderId}/${encodeURIComponent(`${businessRoute.orderAdmin}/${config.ALL}/${showDataType}/${currentPage}/${filter}`)}`}
						>查看</Link>),
					});
				});
				break;
			}
			case config.DONE:{
				rawData.forEach((data) => {
					ret.push({
						orderNo: data.orderId,
						title: this.getGoodsTitle(data.orderItemList),
						// discountDailyRent: data.discountPrice,
						orderTime: this.getOrderTime(data.receiveTime,type,data.dueReturnTime),
						authType: this.getAuthType(data.creditType),
						rentTerm: data.leaseTerm,
						mark: data.remark,
						realPay: WidgetUtil.getTrueCost(data.dueAmount),
						orderState: MappingUtil.shareJewelOrderTypeNumToPreText(data.state),
						actions: (<Link
							to={`${businessRoute.OrderAdminDetail}/${data.orderId}/${encodeURIComponent(`${businessRoute.orderAdmin}/${config.DONE}/${showDataType}/${currentPage}/${filter}`)}`}
						>查看</Link>),
					});
				});
				break;
			}
			case config.ONGOING:{
				rawData.forEach((data) => {
					ret.push({
						orderNo: data.orderId,
						title: this.getGoodsTitle(data.orderItemList),
						// discountDailyRent: data.discountPrice,
						orderTime: this.getOrderTime(data.receiveTime,type,data.dueReturnTime),
						authType: this.getAuthType(data.creditType),
						rentTerm: data.creditType===config.filter.menber.code?'___':data.leaseTerm,
						timeLeft: `${data.remainDay}天`,
						realPay: WidgetUtil.getTrueCost(data.dueAmount),
						orderState: data.remainDay>0?MappingUtil.shareJewelOrderTypeNumToPreText(data.state):'已逾期',
						actions: (<Link
							to={`${businessRoute.OrderAdminDetail}/${data.orderId}/${encodeURIComponent(`${businessRoute.orderAdmin}/${config.ONGOING}/${showDataType}/${currentPage}/${filter}`)}`}
						>查看</Link>),
					});
				});
				break;
			}
			case config.RETURNING:{
				rawData.forEach((data) => {
					ret.push({
						orderNo: data.orderId,
						title: this.getGoodsTitle(data.orderItemList),
						// discountDailyRent: data.discountPrice,
						orderTime: this.getOrderTime(data.receiveTime,type,data.dueReturnTime),
						authType: this.getAuthType(data.creditType),
						rentTerm: data.leaseTerm,
						timeLeft: `${data.remainDay}天`,
						realPay: WidgetUtil.getTrueCost(data.dueAmount),
						orderState: MappingUtil.shareJewelOrderTypeNumToPreText(data.state),
						actions: (<Link
							to={`${businessRoute.OrderAdminDetail}/${data.orderId}/${encodeURIComponent(`${businessRoute.orderAdmin}/${config.RETURNING}/${showDataType}/${currentPage}/${filter}`)}`}
						>查看</Link>),
					});
				});
				break;
			}
			case config.REFUNDS:{
				rawData.forEach((data) => {
					ret.push({
						orderNo: data.orderId,
						title: this.getGoodsTitle(data.orderItemList),
						// discountDailyRent: data.discountPrice,
						orderTime: this.getOrderTime(data.receiveTime,type,data.dueReturnTime),
						authType: this.getAuthType(data.creditType),
						rentTerm: data.leaseTerm,
						timeLeft: `${data.remainDay}天`,
						realPay: WidgetUtil.getTrueCost(data.dueAmount),
						orderState: MappingUtil.shareJewelOrderTypeNumToPreText(data.state),
						actions: (<Link
							to={`${businessRoute.OrderAdminDetail}/${data.orderId}/${encodeURIComponent(`${businessRoute.orderAdmin}/${config.REFUNDS}/${showDataType}/${currentPage}/${filter}`)}`}
						>查看</Link>),
					});
				});
				break;
			}
		}
		return ret;
	};
	query = () => {
		this.setState({
			currentPage: 1,
		},() => {
			this.qryTable();

		});

	};
	renderArgument = (orderId,phoneId) => {
		const olen=orderId.length;
		const plen=phoneId.length;
		 if (olen >0 && plen >0 ) {
			 return { orderId, phoneId };
		 } else if (olen >0 && plen === 0) {
			 return { orderId };
		 }  else if (plen >0 && olen === 0) {
			 return { phoneId };
		 }
	};
	renderTitle = (type) => {
		switch (type){
			case config.ALL:{
				return '所有订单/All orders';
			}
			case config.DONE:{
				return '已完成/Completed';
			}
			case config.ONGOING:{
				return '租赁中/In the lease';
			}
			case config.RETURNING:{
				return '归还中/In the lease';
			}
		}
	};


	renderPagination = ( activePage, total ) => {
		return (<div className="pg-ctr" >
			<Pagination
				defaultCurrent={activePage}
				current={activePage}
				total={total}
				onChange={this.paginationController}
			/>


		</div>);
	};

	renderColumns = (type) => {
		switch (type){
			case config.ALL:{
				return [
					{
						title: '订单号',
						dataIndex: 'orderNo',
						key: 'orderNo',
					}, {
						title: '商品名称',
						dataIndex: 'title',
						key: 'title',
					},
					{
						title: '下单时间',
						dataIndex: 'orderTime',
						key: 'orderTime',
					}, {
						title: '授信',
						dataIndex: 'authType',
						key: 'authType',
					},
					{
						title: '提取方式',
						dataIndex: 'logisticsMode',
						key: 'logisticsMode',
					},
					{
						title: '实付',
						dataIndex: 'realPay',
						key: 'realPay',
					},{
						title: '订单状态',
						dataIndex: 'orderState',
						key: 'orderState',
					},{
						title: '操作',
						dataIndex: 'actions',
						key: 'actions',
					}
				];
			}
			case config.DONE:{
				return [
					{
						title: '订单号',
						dataIndex: 'orderNo',
						key: 'orderNo',
					}, {
						title: '商品名称',
						dataIndex: 'title',
						key: 'title',
					},
					{
						title: '开始/结束',
						dataIndex: 'orderTime',
						key: 'orderTime',
					}, {
						title: '授信',
						dataIndex: 'authType',
						key: 'authType',
					}, {
						title: '租赁天数',
						dataIndex: 'rentTerm',
						key: 'rentTerm',
					},{
						title: '备注',
						dataIndex: 'mark',
						key: 'mark',
					},{
						title: '订单状态',
						dataIndex: 'orderState',
						key: 'orderState',
					},{
						title: '操作',
						dataIndex: 'actions',
						key: 'actions',
					}
				];
			}
			case config.ONGOING:{
				return [
					{
						title: '订单号',
						dataIndex: 'orderNo',
						key: 'orderNo',
					}, {
						title: '商品名称',
						dataIndex: 'title',
						key: 'title',
					},
					{
						title: '开始/预期截止',
						dataIndex: 'orderTime',
						key: 'orderTime',
					}, {
						title: '授信',
						dataIndex: 'authType',
						key: 'authType',
					}, {
						title: '租赁天数',
						dataIndex: 'rentTerm',
						key: 'rentTerm',
					}, {
						title: '待归还',
						dataIndex: 'timeLeft',
						key: 'timeLeft',
					}, {
						title: '订单状态',
						dataIndex: 'orderState',
						key: 'orderState',
					}, {
						title: '操作',
						dataIndex: 'actions',
						key: 'actions',
					}
				];
			}
			case config.RETURNING:{
				return [
					{
						title: '订单号',
						dataIndex: 'orderNo',
						key: 'orderNo',
					}, {
						title: '商品名称',
						dataIndex: 'title',
						key: 'title',
					},
					{
						title: '开始/结束',
						dataIndex: 'orderTime',
						key: 'orderTime',
					}, {
						title: '授信',
						dataIndex: 'authType',
						key: 'authType',
					}, {
						title: '租赁天数',
						dataIndex: 'rentTerm',
						key: 'rentTerm',
					}, {
						title: '待归还',
						dataIndex: 'timeLeft',
						key: 'timeLeft',
					}, {
						title: '订单状态',
						dataIndex: 'orderState',
						key: 'orderState',
					}, {
						title: '操作',
						dataIndex: 'actions',
						key: 'actions',
					}
				];
			}
		}
	};

	renderTabs = (type,filter,tableType,columns=[],dataSource=[],activePage=1,total=10) => {
		const TabPane = Tabs.TabPane;
		const Option = Select.Option;
		switch (type){
			case config.ALL:{
				return (<ShareJewelOrderAll
					tableType={tableType}
					columns={columns}
					dataSource={dataSource}
					activePage={activePage}
					total={total}
					renderPagination={this.renderPagination}
					renderFilter={this.renderFilter}
					filter={filter}
					showDataTypeHandler={this.showDataTypeHandler}
				/>);
			}
			case config.DONE:{
				return (<ShareJewelOrderDone
					tableType={tableType}
					columns={columns}
					dataSource={dataSource}
					activePage={activePage}
					total={total}
					renderPagination={this.renderPagination}
					renderFilter={this.renderFilter}
					filter={filter}
					showDataTypeHandler={this.showDataTypeHandler}
				/>);
			}
			case config.ONGOING:{
				return (<ShareJewelOrderOnGoing
					tableType={tableType}
					columns={columns}
					dataSource={dataSource}
					activePage={activePage}
					total={total}
					renderPagination={this.renderPagination}
					renderFilter={this.renderFilter}
					filter={filter}
					showDataTypeHandler={this.showDataTypeHandler}
				/>);
			}
			case config.RETURNING:{
				return (<ShareJewelOrderReturning
					tableType={tableType}
					columns={columns}
					dataSource={dataSource}
					activePage={activePage}
					total={total}
					renderPagination={this.renderPagination}
					renderFilter={this.renderFilter}
					filter={filter}
					showDataTypeHandler={this.showDataTypeHandler}
				/>);
			}
		}
	};

	renderFilter = (defaultValue) => {
		const Option = Select.Option;
		const cssObj={
			marginRight: 15
		};
		return (<div className="admin-ctr" >
			<span style={cssObj}>
									订单编号: &nbsp;
				<Input
					style={{ width: 155 }}
					onChange={(obj) => {
						this.setState({
							goodIdValue: obj.target.value
						});
					}}

				/>
			</span>

			<span style={cssObj}>
									手机号码: &nbsp;
				<Input
					style={{ width: 155 }}
					onChange={(obj) => {
						this.setState({
							mobile: obj.target.value
						});
					}}

				/>
			</span>

			<Button
				type="primary"
				icon="search"
				onClick={this.query}
				style={cssObj}
			>查询</Button>
			<span style={cssObj} className="gray"> | </span>
			<Select
				defaultValue={defaultValue}
				style={{ width: 120 }}
				onChange={this.statusSelector}
			>
				<Option value={config.filter.all.val} >全部</Option>
				<Option value={config.filter.menber.val} >会员</Option>
				<Option value={config.filter.deposit.val} >押金</Option>
				<Option value={config.filter.zmxy.val} >芝麻</Option>
			</Select>
		</div>);
	};
	renderDebug = (args=[]) => {
		const ret=[];
		if (typeof args !== 'object'){
			return -1;
		}
		args.forEach((val,key) => {
			ret.push(`${key}:${val},`);
		});
		return ret;
	};


	render () {
		const { params } = this.props;
		const { type } = params;
		// const page=parseInt(params.page);
		const { showDataType,filter,currentPage,total } = this.state;
		const TabPane = Tabs.TabPane;
		const Option = Select.Option;
		const columns = this.renderColumns(type);
		const { orderList } =this.props;
		const rawList = orderList.records||[];
		const dataSource = this.dataSerialize(type,rawList);
		return (<div className="share-jewel-order-admin-page" >
			{/*{this.renderDebug([showDataType,filter,currentPage,total])}*/}
			{/*{filter}*/}
			<Row>
				<Col span={24} >
					<h3 style={{ fontSize: '36px', marginBottom: '20px' }} >{this.renderTitle(type)}</h3>
				</Col>
				<Col span={24} >
					<div className="admin-main" >
						{this.renderTabs(type,filter,showDataType,columns,dataSource,currentPage,total)}
					</div>
				</Col>
			</Row>

		</div>);
	}
}

const mapStateToProps = (state) => {
	const { orderList } = state.get('QryShareJewelOrdersReducer').toObject();
	const stateObje = {
		orderList
	};
	return stateObje;
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryShareJewelOrders,
			qryShareJewelOrdersRenting
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareJewelOrderAdmin);
