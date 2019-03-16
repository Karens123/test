'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { parseDateTime,getDiffDayFromNow } from 'utils/DateUtil';
import { Col, Row, Table, Tabs, Select, Pagination, Modal, Input, Button, Icon } from 'antd';
import {
	dealOrderDetailInfo,
	qryOrderAll,
	BackGoodsHandleSubmit,
	OrderNoticeReturn,
	ORDER_BACK_GOODS_SUBMIT,
	ORDER_NOTICE_RETURN,
	ORDER_DETAIL_INFO,
	OrderCancelReturnPay,
	ORDER_CANCEL_RETURN_PAY
} from 'action';
import * as Constant from 'utils/Constant';
import * as businessRoute from 'business/route';

import OrderStep from 'business/sharejewel/widget/orderstep';
import LeaseInformation from 'business/sharejewel/widget/LeaseInformation';//租凭人信息
import PaymentDistribution from 'business/sharejewel/widget/PaymentDistribution';//支付与配送
import OrderDetailList from 'business/sharejewel/widget/OrderDetailList';
import OrderReturn from 'business/sharejewel/widget/OrderReturn';
import OrderRemark from 'business/sharejewel/widget/OrderRemark';
import OrderLogisticsList from 'business/sharejewel/widget/OrderLogisticsList';
import optsConfig from 'res/LogisticsConfig';

import * as MsgUtil from 'utils/MsgUtil';

import './index.less';

const Option = Select.Option;
const { TextArea } = Input;

class OrderAdminDetail extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
		params: PropTypes.object,
		OrderAll: PropTypes.object,
		currentUser: PropTypes.object,
	};

	static defaultProps = {
		params: {},
		OrderAll: {},
		OrderDone: {},
		OrderOnGoing: {},
		OrderReturning: {},
		currentUser: {},

	};

	constructor (props) {
		super(props);
		this.state = {
			step: '',
			realStep: '',
			stepStr: '',
			leaseWorkerInfo: {},
			changeShopInfo: {},
			selectValue: '',
			selectName: '',
			currentOrderStatus: '',
			remarkValue: undefined,
			creditInfoData: '',
			inspectionList: [],

			OrderAll: '',
			OrderDone: '',
			OrderOnGoing: '',
			OrderReturning: '',

			SendGoodsAction: {},
			orderLogisticsListInfo: '',
			wenwenId: '',
			isShouldUpdate: false,
			currentOrderId: undefined,
			allGoodsAction: {
				orderStatus: ''
			},
			refresh: false,
			isCanceOrder: undefined,
			memberzmScore: () => {
				return '';
			},
			sendGoodsSucessState: false,
			backGoodsSucessState: false,
			self: undefined,
			logisticsMode: 2, //物流方式：0-不配送 1-快递运输 2-上门自提
			orderKindStatus: '',
			orderCloseId: {
				closeId: undefined,
				reason: '',
				detail: ''
			}
		};

	}

	componentWillMount () {
		const { leaseWorkerInfo } = this.state;
		const { params, actions } = this.props;
		//全部订单, 租凭中, 归还三种数据开关
		const ret = {  orderId: this.props.params && this.props.params.Id ? this.props.params.Id: MsgUtil.showwarning('数据加载失败') }; //1:为全部订单 2:租凭中  3:归还
		actions.qryOrderAll(ret);
	}


	componentWillReceiveProps (nextProps) {
		const { OrderAll } = nextProps;

		let DataWarp = {};
		if (OrderAll.record) {
			DataWarp = { ...OrderAll.record };
		}
		console.log('DataWarp____________________________:', DataWarp);
		//只切换会员和非会员
		const allGoodsAction = {
			// orderStatus: 2 // 0:普通订单详情  2: 会员订单订单详情
			orderStatus: DataWarp && DataWarp.memberInfo ? 2 :0
			 };

		//租凭中的订单详情，是否是会员 开关
		const SendGoodsAction = {
			logisticsName: '顺风快递',
			logisticsNumber: '123456789',
			memberOrder: 1 //0: 普通  1: 会员
		};

		let mystep=5; //开关
		const { params } = nextProps;
		mystep=(DataWarp && DataWarp.orderInfo ? DataWarp.orderInfo.state: '')*1;
		console.log('mystep________________________day 11,25', mystep);

	/*	if (params.step) {
			mystep=params.step*1;
		} else {
			mystep=(DataWarp && DataWarp.orderInfo ? DataWarp.orderInfo.state: '')*1;
		}*/
		//归还中的订单详情,是否归还 开关
		const ReturnGoodsAction = {
			logisticsName: '顺风快递',
			logisticsNumber: '123456789',
			returnStatus: mystep==6 ? mystep :mystep==7 || mystep==8 ? 8: '', //1: 归还中  0: 归还订单完成,
			remark: '货物无任何损坏'
		};

		let logisticsModeSef=false; //记得改回来为false
		if (DataWarp.orderInfo && DataWarp.orderInfo.logisticsMode==2) {
			logisticsModeSef=true;
		}
		console.log('DataWarp.orderInfo && DataWarp.orderInfo.logisticsMode__________________', logisticsModeSef);

		this.setState({
			//物流方式：0-不配送 1-快递运输 2-上门自提  //记得改回来为下面
			// logisticsMode: 2,
			orderCloseId: {
				closeId: DataWarp && DataWarp.orderCloseInfo && DataWarp.orderCloseInfo.closeId ? DataWarp.orderCloseInfo.closeId:'',
				reason: DataWarp && DataWarp.orderCloseInfo && DataWarp.orderCloseInfo.reason ? DataWarp.orderCloseInfo.reason:'',
				detail: DataWarp && DataWarp.orderCloseInfo && DataWarp.orderCloseInfo.detail ? DataWarp.orderCloseInfo.detail:'',
			},
			self: this.setLogisticsMode(DataWarp),
			// orderKindStatus: 12, //开关： 11; //已确认付款/待自提  12; //已取消/待退款 13; //退款审核通过/退款中 14; //已退款/结束
			orderKindStatus: DataWarp && DataWarp.orderInfo ? DataWarp.orderInfo.state: '',
			currentOrderStatus: DataWarp && DataWarp.orderInfo ? DataWarp.orderInfo.state: '',  //数据总开关数据传入currentOrderStatus
			allGoodsAction: {
				orderStatus: allGoodsAction && allGoodsAction.orderStatus ?allGoodsAction.orderStatus :''
			},
			wenwenId: DataWarp && DataWarp.memberInfo ? DataWarp.memberInfo.wenwenId: '',
			SendGoodsAction,
			ReturnGoodsAction,
			realStep: mystep==4 || mystep==3 ?this.renderRealStep(mystep,logisticsModeSef): mystep,
			memberzmScore: () => {
				//会员 芝麻信用  押金
				if (allGoodsAction.orderStatus == 2) {
					return `${DataWarp.memberInfo && DataWarp.memberInfo.dueAmount ? `会员(${((DataWarp.memberInfo.dueAmount)/100).toFixed(2)}),` : ' '}  ${DataWarp.creditInfo && DataWarp.creditInfo.zmScore ? `芝麻信用(${DataWarp.creditInfo.zmScore}),` :' '}  ${DataWarp.creditInfo && DataWarp.creditInfo.deposit ? `押金(${((DataWarp.creditInfo.deposit)/100).toFixed(2)}元)`: ' '}`;
				} else if (allGoodsAction.orderStatus == 0){
					// 芝麻信用  押金
					return ` ${DataWarp.creditInfo && DataWarp.creditInfo.zmScore ? `芝麻信用(${DataWarp.creditInfo.zmScore}),`  :' '}    ${DataWarp.creditInfo && DataWarp.creditInfo.deposit ? `押金(${((DataWarp.creditInfo.deposit)/100).toFixed(2)})元`: ' '}`;
				} else {
					//会员 芝麻信用  押金都不是
					return '';
				}
			},
			step: (( () => {

				if (DataWarp.orderInfo) {
					switch (mystep) { //DataWarp.orderInfo.state
						//0-取消/交易关闭
						// 1-已创建/待付款
						// 2-已付款/待确认
						// 3-已确认/待发货
						// 4-已发货/待收货
						// 5-已收货/待归还
						// 6-已归还/待验收
						// 7-已验收/待赔偿
						// 8-已验收/结束
						case 0: {
							return 0;
						}
						case 1: {
							return 1;
						}
						case 2: {
							return 2;
						}
						case 3: {
							return 3;
						}
						case 4: {
							return 3;
						}
						case 5: {
							return 5;
						}
						case 6: {
							return 6;
						}
						case 7: {
							return 8;
						}
						case 8: {
							return 8;
						}
						case 9: {
							return 9;
						}
						case 10: {
							return 10;
						}
						case 11: {
							return 11;
						}
						case 12: {
							return 12;
						}
						case 13: {
							return 13;
						}
						case 14: {
							return 14;
						}
					}
				}

			})())
		},() => {

			this.SwitchData(this.state.currentOrderStatus,DataWarp);
		});

		const { rspInfo, actionType } = nextProps;
		const {  actions } = this.props;
		//全部订单, 租凭中, 归还三种数据开关
		const ret = {  orderId: this.props.params && this.props.params.Id ? this.props.params.Id: MsgUtil.showwarning('数据加载失败') }; //1:为全部订单 2:租凭中  3:归还

		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {

				let flag=false;

				if (rspInfo.resultCode === Constant.REST_OK) {

					if (`${ORDER_BACK_GOODS_SUBMIT}_SUCCESS` === actionType) {
						flag=true;
						this.setState({ refresh: true,backGoodsSucessState: true },() => {
							MsgUtil.showwarning('提交成功');
						});
					}
					if (`${ORDER_CANCEL_RETURN_PAY}_SUCCESS` === actionType) {
						flag=true;
						MsgUtil.showwarning('退款成功');

					/*	this.setState({ refresh: true,backGoodsSucessState: true },() => {
							MsgUtil.showwarning('提交成功');
						});*/

					}


					if (`${ORDER_NOTICE_RETURN}_SUCCESS` === actionType) {
						MsgUtil.showwarning('提醒成功');
					}

					if (`${ORDER_DETAIL_INFO}_SUCCESS` === actionType) {
						this.setState({ refresh: true, sendGoodsSucessState: true },() => {
							MsgUtil.showwarning('发货成功');
							flag=true;
						});

						this.setState({
							isShouldUpdate: true
						});
					}

				}

				if (flag) {
					actions.qryOrderAll(ret);
				}
			}
		}
	}

	componentWillUnmount(){
		this.setState({
			step: '',
			realStep: '',
		});
	}
	getTextareaValue = (remarkValue) => {
		this.setState({
			remarkValue
		});
	};

	setLogisticsMode =(DataWarp) => {
		if (DataWarp && DataWarp.orderInfo && DataWarp.orderInfo.logisticsMode) {

			let num='';
			switch (DataWarp.orderInfo.logisticsMode) {  //物流方式：0-不配送 1-快递运输 2-上门自提
				case 0: {
					num=0;
					break;
				}
				case  1: {
					num=1;
					break;
				}
				case  2: {
					num=2;
					break;
				}
			}
			return num;
		}

	};
	SwitchData = (currentOrderStatus,DataWarp) => {
		const data = [{
			orderId: DataWarp && DataWarp.orderInfo ? DataWarp.orderInfo.orderId :'',
			leaseName: DataWarp && DataWarp.userInfo ? DataWarp.userInfo.nick :'',
			couponAmount: DataWarp && DataWarp.orderInfo ? (DataWarp.orderInfo.couponAmount/100).toFixed(2) :'',
			overdueAmount: DataWarp && DataWarp.orderInfo ? DataWarp.orderInfo.overdueAmount :'',
			address: DataWarp && DataWarp.orderInfo ? DataWarp.orderInfo.address :'',
			phoneId: DataWarp && DataWarp.userInfo ? DataWarp.userInfo.phoneId :'',
			receiveTime: DataWarp && DataWarp.orderInfo ? DataWarp.orderInfo.receiveTime :'',
			returnTime: DataWarp && DataWarp.orderInfo ? DataWarp.orderInfo.returnTime :'',
			remainDay: DataWarp && DataWarp.orderInfo ? DataWarp.orderInfo.remainDay :'',
			leaseTime: DataWarp && DataWarp.orderInfo ? DataWarp.orderInfo.leaseTerm :'',
			createTime: DataWarp && DataWarp.orderInfo ? parseDateTime(DataWarp.orderInfo.createTime) :'',
			shopName: ((() => {
				if (DataWarp.orderInfo && DataWarp.orderInfo.orderItemList ) {
					const orderItemList=DataWarp.orderInfo.orderItemList;
					const itemArray=[];
					orderItemList.forEach((item,index) => {
						itemArray.push(<div className="shopName" >
							<img
								style={{ float: 'left' }}
								src={item && item.advertisePic ? item.advertisePic: ''}
								width={80}
							/>
							<div style={{ textAlign: 'left', marginLeft: 10,lineHeight: '22px' }}>{item && item.goodsTitle ? item.goodsTitle: ''}<br />{item && item.goodsSubTitle ? item.goodsSubTitle : ''} <br />{item && item.remark ? this.renderRemark(item.remark) : ''}</div>

						</div>);
					});
					return itemArray;
				}
			})()),
			orderTime: DataWarp && DataWarp.orderInfo ? DataWarp.orderInfo.createTime :'',
			creditType: DataWarp && DataWarp.orderInfo ? DataWarp.orderInfo.creditType :'',
			salePrice: ((() => {
				if (DataWarp.orderInfo && DataWarp.orderInfo.orderItemList ) {
					const orderItemList=DataWarp.orderInfo.orderItemList;
					const itemArray=[];
					orderItemList.forEach((item,index) => {
						itemArray.push((((item.salePrice)*1) / 100).toFixed(2));
					});
					return itemArray;
				}
			})()),
			discountPrice: ((() => {
				if (DataWarp.orderInfo && DataWarp.orderInfo.orderItemList ) {
					const orderItemList=DataWarp.orderInfo.orderItemList;
					const itemArray=[];
					orderItemList.forEach((item,index) => {
						itemArray.push((((item.discountPrice)*1) / 100).toFixed(2));
					});
					return itemArray;
				}
			})()),
			orderStatus: 1, //1:为订单详情和会员订单订单详情 2：己发货订单详情
			logistics: 0,
			price: (100 / 100).toFixed(2),
			payoff: 60,
			saveData: '100',
			freight: DataWarp && DataWarp.orderInfo ? (DataWarp.orderInfo.freight/100).toFixed(2) :'',
			payType: DataWarp && DataWarp.orderInfo ? DataWarp.orderInfo.payType :'',
			receiverName: DataWarp && DataWarp.orderInfo ? DataWarp.orderInfo.receiverName :'',
			receiverPhone: DataWarp && DataWarp.orderInfo ? DataWarp.orderInfo.receiverPhone :'',
			totalAmount: DataWarp && DataWarp.orderInfo ? (DataWarp.orderInfo.totalAmount/100).toFixed(2) :'',
			offsetAmount: DataWarp && DataWarp.orderInfo ? (DataWarp.orderInfo.offsetAmount/100).toFixed(2) :'',
			dueAmount: DataWarp && DataWarp.orderInfo ? <span className="red">{(DataWarp.orderInfo.dueAmount/100).toFixed(2)}</span> :'',
			state: DataWarp && DataWarp.orderInfo ? DataWarp.orderInfo.state :'',
			realDaylesaeAmount: (( () => {
				if (DataWarp.orderInfo) {
					return (((DataWarp.orderInfo.totalAmount-DataWarp.orderInfo.offsetAmount)/DataWarp.orderInfo.leaseTerm)/100).toFixed(2);
					// (((DataWarp.orderInfo && DataWarp.orderInfo.totalAmount - DataWarp.orderInfo && DataWarp.orderInfo.offsetAmount)/DataWarp.orderInfo && DataWarp.orderInfo.leaseTerm)/100).toFixed(2),
				}
			})()),
 			memberInfo: DataWarp && DataWarp.memberInfo ? DataWarp.memberInfo.remainRentTimes :'',

		},];


		const orderId=DataWarp && DataWarp.porderInfo ? DataWarp.porderInfo.orderId :'';
		const pOrderData = [{
			orderId,
			leaseTime: DataWarp && DataWarp.porderInfo ? DataWarp.porderInfo.leaseTerm :'',
			goodsName: ((() => {
				if (DataWarp.porderInfo && DataWarp.porderInfo.orderItemList ) {
					const orderItemList=DataWarp.porderInfo.orderItemList;
					const itemArray=[];
					orderItemList.forEach((item,index) => {
						itemArray.push(<div className="shopName" >
							<div style={{ float: 'left' }} >{item && item.goodsTitle ? item.goodsTitle: ''}<br />{item && item.goodsSubTitle ? item.goodsSubTitle : ''} <br />{item && item.remark ?  this.renderRemark(item.remark): ''}</div>
							<img
								src={item && item.advertisePic ? item.advertisePic: ''}
								width={80}
							/>
						</div>);
					});
					return itemArray;
				}
			})()),
			orderTime: DataWarp && DataWarp.porderInfo ? DataWarp.porderInfo.createTime :'',
			creditType: DataWarp && DataWarp.porderInfo ? DataWarp.porderInfo.creditType :'',
			salePrice: ((() => {
				if (DataWarp.porderInfo && DataWarp.porderInfo.orderItemList ) {
					const orderItemList=DataWarp.porderInfo.orderItemList;
					const itemArray=[];
					orderItemList.forEach((item,index) => {
						itemArray.push((((item.salePrice)*1) / 100).toFixed(2));
					});
					return itemArray;
				}
			})()),
			discountPrice: ((() => {
				if (DataWarp.porderInfo && DataWarp.porderInfo.orderItemList ) {
					const orderItemList=DataWarp.porderInfo.orderItemList;
					const itemArray=[];
					orderItemList.forEach((item,index) => {
						itemArray.push((((item.discountPrice)*1) / 100).toFixed(2));
					});
					return itemArray;
				}
			})()),
			totalAmount: DataWarp && DataWarp.porderInfo ? (DataWarp.porderInfo.totalAmount/100).toFixed(2) :'',
			offsetAmount: DataWarp && DataWarp.porderInfo ? (DataWarp.porderInfo.offsetAmount/100).toFixed(2) :'',
			dueAmount: DataWarp && DataWarp.porderInfo ? <span className="red">{(DataWarp.porderInfo.dueAmount/100).toFixed(2)}</span> :'',
			state: DataWarp && DataWarp.porderInfo ? (DataWarp.porderInfo.state== 0 ? '已发货' : DataWarp.porderInfo.state== 1 ? '运输中' : DataWarp.porderInfo.state== 2 ? '已签收': ''  ) :'',
			realDaylesaeAmount: (( () => {
				if (DataWarp.orderInfo) {
					return (((DataWarp.orderInfo.totalAmount-DataWarp.orderInfo.offsetAmount)/DataWarp.orderInfo.leaseTerm)/100).toFixed(2);
				}
			})()),
			memberInfo: DataWarp && DataWarp.memberInfo ? DataWarp.memberInfo.remainRentTimes :'',
			action: <div><a href={`${businessRoute.OrderAdminDetail}/${orderId}/${6}`} target="_blank" rel="noopener noreferrer" >查看</a> </div>
		},];

		const orderLogisticsListData=[];
		if (DataWarp.orderLogisticsList) {
			const orderId=DataWarp && DataWarp.orderInfo ? DataWarp.orderInfo.orderId :'';
			for ( let i=0;i<DataWarp.orderLogisticsList.length; i++ ) {
				const bussinessName=DataWarp.orderLogisticsList && DataWarp.orderLogisticsList[i].bussinessName;
				const logisticsTradeNo=DataWarp.orderLogisticsList && DataWarp.orderLogisticsList[i].logisticsTradeNo;
				orderLogisticsListData.push({
					bussinessName,
					logisticsTradeNo,
					logisticsBussiness: DataWarp.orderLogisticsList && DataWarp.orderLogisticsList[i].logisticsBussiness,
					logisticsId: DataWarp.orderLogisticsList && DataWarp.orderLogisticsList[i].logisticsId,
					receiverAddress: DataWarp.orderLogisticsList && DataWarp.orderLogisticsList[i].receiverAddress,
					receiverName: DataWarp.orderLogisticsList && DataWarp.orderLogisticsList[i].receiverName,
					logisticsType: DataWarp.orderLogisticsList && DataWarp.orderLogisticsList[i].logisticsType==0 ? '总部发货' :DataWarp.orderLogisticsList[i].logisticsType==1 ? '归还': DataWarp.orderLogisticsList[i].logisticsType==2 ? '退货':'' ,
					state: DataWarp.orderLogisticsList && DataWarp.orderLogisticsList[i].state==0 ? '已发货' :DataWarp.orderLogisticsList[i].state==1 ? '运输中': DataWarp.orderLogisticsList[i].state==2 ? '已签收':'' ,
					action: <a href={`${businessRoute.OrderLogisticsDetails}/${bussinessName}/${logisticsTradeNo}/${orderId}`} rel="noopener noreferrer" >查看</a> ,
				});
			}
		}

		const inspectionList=[];
		if (DataWarp.inspectionList) {
			for ( let i=0;i<DataWarp.inspectionList.length; i++ ) {
				inspectionList.push({
					inspectionId: DataWarp.inspectionList && DataWarp.inspectionList[i].inspectionId,
					orderId: DataWarp.inspectionList && DataWarp.inspectionList[i].orderId,
					inspectorId: DataWarp.inspectionList && DataWarp.inspectionList[i].inspectorId,
					inspectionTime: DataWarp.inspectionList && DataWarp.inspectionList[i].inspectionTime,
					inspectionResult: DataWarp.inspectionList && DataWarp.inspectionList[i].inspectionResult,
					dealId: DataWarp.inspectionList && DataWarp.inspectionList[i].receiverName,
					dealResult: DataWarp.inspectionList && DataWarp.inspectionList[i].dealResult,
					remark: DataWarp.inspectionList && DataWarp.inspectionList[i].remark ,
				});
			}

		}

		const orderItemList=[];
		if (DataWarp.orderInfo && DataWarp.orderInfo.orderItemList) {
			for ( let i=0;i<DataWarp.orderInfo.orderItemList.length; i++ ) {

				orderItemList.push({
					shopName: (<div className="shopName" >
						<img
							style={{ float: 'left' }}
							src={DataWarp.orderInfo.orderItemList && DataWarp.orderInfo.orderItemList[0].advertisePic ? DataWarp.orderInfo.orderItemList[i].advertisePic: ''}
							width={80}
						/>
						<div style={{ textAlign: 'left', marginLeft: 10,lineHeight: '22px' }}>{DataWarp.orderInfo.orderItemList[i] && DataWarp.orderInfo.orderItemList[i].goodsTitle ? DataWarp.orderInfo.orderItemList[i].goodsTitle: ''}<br />{DataWarp.orderInfo.orderItemList[i] && DataWarp.orderInfo.orderItemList[i].goodsSubTitle ? DataWarp.orderInfo.orderItemList[i].goodsSubTitle : ''} <br />{DataWarp.orderInfo.orderItemList[i] && DataWarp.orderInfo.orderItemList[i].remark ? this.renderRemark(DataWarp.orderInfo.orderItemList[i].remark) : ''}</div>

					</div>),
					discountPrice: DataWarp.orderInfo.orderItemList[i] && `￥${(DataWarp.orderInfo.orderItemList[i].discountPrice/100).toFixed(2)}`,
					discountRents: DataWarp.orderInfo.orderItemList[i] && `￥${(DataWarp.orderInfo.orderItemList[i].discountRents/100).toFixed(2)}`,
					dailyRents: DataWarp.orderInfo.orderItemList[i] && `￥${(DataWarp.orderInfo.orderItemList[i].dailyRents/100).toFixed(2)}`,
					goodsSalePrice: DataWarp.orderInfo.orderItemList[i] && `￥${(DataWarp.orderInfo.orderItemList[i].goodsSalePrice/100).toFixed(2)}`,
					salePrice: DataWarp.orderInfo.orderItemList[i] && `￥${(DataWarp.orderInfo.orderItemList[i].salePrice/100).toFixed(2)}`,
					orderId: DataWarp.orderInfo.orderItemList[i] && DataWarp.orderInfo.orderItemList[i].orderId,
					goodsSubTitle: DataWarp.orderInfo.orderItemList[i] && DataWarp.orderInfo.orderItemList[i].goodsSubTitle,
					remark: DataWarp.orderInfo.orderItemList[i] && DataWarp.orderInfo.orderItemList[i].remark,
					goodsNum: DataWarp.orderInfo.orderItemList[i] && DataWarp.orderInfo.orderItemList[i].goodsNum,
					leaseTime: `${DataWarp.orderInfo && DataWarp.orderInfo.leaseTerm}天`,
				});
			}
		}

		const logisticsMode_num=2;
		this.setState({
			logisticsMode: logisticsMode_num,  //物流方式：0-不配送 1-快递运输 2-上门自提
			orderItemList,
			currentOrderId: data[0].orderId,
			leaseWorkerInfo: {
				...data[0]
			},
			changeShopInfo: {
				...pOrderData[0]
			},
			creditInfoData: {
				creditInfo: DataWarp.creditInfo
			},
			orderLogisticsListInfo: orderLogisticsListData,
			inspectionList
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const logisticsId = this.refs.orderId.refs.input.value;
		const { selectValue ,leaseWorkerInfo,wenwenId,orderLogisticsListInfo } = this.state;
		const { actions } = this.props;
		const selectValueKey=selectValue.split('-')[0];
		const bussinessName=selectValue.split('-')[1];

		if (Object.is(logisticsId.length, 0) || Object.is(selectValueKey.length, 0)) {
			if (Object.is(selectValueKey.length, 0)) {
				MsgUtil.showwarning('配送物流不能为空');
				return;
			}
			if (Object.is(logisticsId.length, 0)) {
				MsgUtil.showwarning('物流订单不能为空');
			}

		} else {

			const logisticsMode=1; //物流方式：0-不配送 1-快递运输 2-上门自提
			const state=leaseWorkerInfo.state;

			//物流类型 0-总部发货,1-归还,2-退货
			let logisticsType=0;
			if (state>=0 && state<=4) {
				logisticsType=0;
			} else if (state>4 && state<=6){
				logisticsType=1;
			} else   {
				logisticsType=2;
			}

			const obj = {
				bussinessName,
				orderId: leaseWorkerInfo.orderId,    //订单ID
				logisticsBussiness: selectValueKey*1,    //物流公司
				logisticsTradeNo: logisticsId,   //物流单号
				logisticsType,
				logisticsMode,
				state,
			};
			actions.dealOrderDetailInfo(obj,wenwenId);
		}
	};

	remindBackSubmit = () => {
		const { actions } = this.props;
		const { currentOrderId } = this.state;
		const ret= {
			orderId: currentOrderId,
			noticeType: 4
		};
		actions.OrderNoticeReturn(ret);
	};
	submitReturnPay = () => {
		const { actions } = this.props;
		const { currentOrderId,wenwenId } = this.state;
		const ret= {
			dealRemark: '',
			operType: 2,
			record: {
				orderId: currentOrderId,
				wenwenId,
				// state:
			}
		};

		console.log('ret________________________________', ret);
		actions.OrderCancelReturnPay(ret);
	};

	goodsBackSucessSubmit = () => {
		const { actions,currentUser } = this.props;
		const { remarkValue,leaseWorkerInfo } = this.state;


		const ret={
			orderId: leaseWorkerInfo.orderId,
			operType: 5,
			dealResult: remarkValue,
			wenwenId: currentUser.userId
		};
		console.log('leaseWorkerInfo.state==6_____________________', ret);
		actions.BackGoodsHandleSubmit(ret);
	};

	RemarkHaveBackNode = () => {
		const { inspectionList } =this.state;
		if (Array.isArray(inspectionList)) {
			const rmarkArray=[];
			inspectionList.length !==0 ?inspectionList.map((item,index) => {
				rmarkArray.push(<p>{item.inspectionResult}</p>);
			}):<div style={{ paddingTop: 10 }}>暂无数据</div>;
			return <div>{rmarkArray}</div>;
		}

	};
	renderRemark = (remark) => {
		let priceStr='';
		priceStr=remark.split('/')[0].split('￥')[1]*1;
		return <div><p>￥{priceStr}元/天</p><p>{remark.split(' ')[1]}</p><p> {remark.split(' ')[2]}</p></div>;
	};

	renderRealStep = (mystep,logisticsModeSef) => {
		if (logisticsModeSef) {
			if (mystep==4) {
				this.setState({
					stepStr: '已提取'
				});
			} else if (mystep==3) {
			/*	this.setState({
					stepStr: '已退款'
				});*/
			}
			return 5;  //只要是自提取的，直接升到5步

		} else {
			if (mystep==4) {
				this.setState({
					stepStr: '已发货'
				});
			}
			return 3;
		}
	};

	render () {
		const { leaseWorkerInfo, changeShopInfo,step,inspectionList,self,orderKindStatus } = this.state;
		console.log('leaseWorkerInfoleaseWorkerInfoleaseWorkerInfoleaseWorkerInfoleaseWorkerInfo________________:', leaseWorkerInfo);
		const { Option } = Select;
		const OrderGoodsNode = (<div><Col span={24} >
			<div className="title" >发货操作</div>
		</Col>
			<Row>
				&nbsp;
			</Row></div>);

		const OrLogisticsListNode = (<div ><Col span={24} >
			<div className="title" >物流信息</div>
		</Col>
			<Row>
				&nbsp;
			</Row></div>);

		const { allGoodsAction,creditInfoData } = this.state;

		const BackGoodsNode = (<div><Col span={24} >
			<div className="title" >待归还</div>
		</Col>
			<Row>
				&nbsp;
			</Row></div>);


		const RemarkNode = (<div><Col span={24} >
			<div className="title" >备注</div>
		</Col>
			<Row>
				&nbsp;
			</Row></div>);
		const changeLeaseNode = (<div><Col span={24} >
			<div className="title" >换租</div>
		</Col>
			<Row>
				&nbsp;
			</Row></div>);


		const selfGoodsWay =  (arg) => {
			return <div style={{ padding: '20px 10px',  }}>提取状态: {arg}</div>;
		 };

		const overdue =  (overDueInfo) => {
			console.log('s_________________', typeof ((overDueInfo.remainDay)*1));
			console.log('s_________________', (overDueInfo.remainDay)*1);
			if ((overDueInfo.remainDay)*1 < 0) {
				return (<div style={{ padding: '0px 10px',lineHeight: '35px' ,marginTop: '-15px' }}>
					<p>逾期天数: {(overDueInfo.remainDay)*1*(-1)}天</p>
					<p>需要缴付的逾期金额: {(overDueInfo.overdueAmount/100).toFixed(2)}元</p>
				</div>);
			}

		};


		const cancelResult= (arg) => {
			console.log('cancelResult_________________________________________', arg);
			return arg && arg.closeId && (<div>
				<div style={{ padding: '20px 10px 10px', backgroundColor: '#f1f2f3' }}>取消原因: {arg.reason}</div>
				<div style={{ padding: '0px 10px 20px', backgroundColor: '#f1f2f3' }}>取消详情: {arg.detail}</div>
				</div>);

		};


		const renderSelect = () => {
			const currentItem=[];
			for(const value in optsConfig) {
				const config = optsConfig[value];
				currentItem.push(<Option value={`${value}-${config.logisticsBussiness}`} >{config.label}</Option>);
			}
			 return currentItem;
		};

		const renderOrderAllDistribution = () => {
			const { allGoodsAction } = this.state;
			const element=(<Row><Row>
				<Col span={2} className="fnt14" >
					配送物流：
				</Col>

				<Col span={22} >
					<Select
						style={{ width: 155 }}
						placeholder="请选择"
						size="large"
						onChange={(value) => {
							 this.setState({
								selectValue: value,
							});
						}
						}
					>
						{ renderSelect() }
					</Select>
				</Col>
			</Row>
				<Row>
					&nbsp;
				</Row>
				<Row>
					<Col span={2} className="fnt14" >
						物流订单：
					</Col>
					<Col span={22} >
						<Input
							placeholder="请填写正确的订单号..."
							size="large"
							ref="orderId"
							style={{
								width: 250
							}}
						/>
					</Col>
				</Row></Row>);

			if (leaseWorkerInfo ) {
				return (
					<Row style={{ paddingTop: 20 }} >
						{((() => {
							//普通
							if (this.state.step == 1) {
							} else if (this.state.step == 2) {
							} else if (this.state.step == 3) {

								if (this.state.stepStr=='已发货') { //说明是第四步 ，stepStr己付值
									return '';
								} else if (this.state.self==2) { //this.state.self==2是自提
									return (<div>
										{OrderGoodsNode}
										{selfGoodsWay('已提取')}

									</div>);

								} else {
									if (!this.state.refresh) {
										return OrderGoodsNode;  //发货操作标题
									}
								}
							} else if (this.state.step == 4) {

								if (this.state.stepStr=='已发货') {
									return '';
								} else {
									return OrLogisticsListNode;  //物流信息标题
								}
							}
						})())}

						{((() => {
							//普通
							if (this.state.step == 1) {

							} else if (this.state.step == 2) {
							} else if (this.state.step == 3) {

								if (this.state.stepStr=='已发货') { //真实是第四步，返回第三步
									return '';
								} else if (this.state.stepStr=='已退款') { //说明是自提方式

									return (selfGoodsWay(this.state.stepStr));
								} else if (this.state.stepStr=='已提取') { //说明是自提方式
									return '';
								} else  {
									if (!this.state.refresh) {

										if (this.state.self==2) {  //说明是自提方式
											return false;
										} else {
											return element;  //物流输入框
										}

									}
								}

							} else if (this.state.step == 4) {

								if (this.state.stepStr=='已发货') {
									return '';
								} else {
									return <OrderLogisticsList orderLogisticsListInfo={this.state.orderLogisticsListInfo} />;
								}
							}
						})())}


						{/*//返回物流信息头部*/}
						{((() => {
							if (this.state.step == 3) {
								if (this.state.stepStr=='已发货') {
									return OrLogisticsListNode;
								}
							}
						})())}

						{((() => {
							//普通
							    if (this.state.step == 3) {
								if (this.state.stepStr=='已发货') {
									return <OrderLogisticsList orderLogisticsListInfo={this.state.orderLogisticsListInfo} />;
								}
							}
						})())}

						{((() => {
							//普通
							if (this.state.step == 1) {
							} else if (this.state.step == 2) {
							} else if (this.state.step == 3) {
								if (this.state.stepStr=='已发货') {
									return '';
								} else if (this.state.self==2) {

									{ /*return (<Row style={{ textAlign: 'center', padding: '50px' }} >
										<Button type="primary" size="large" onClick={this.handleSubmit} >确认退款</Button>
									</Row>);*/ }
									return '';

								} else {
									if (!this.state.refresh){
										return (<Row style={{ textAlign: 'center', padding: '50px' }} >
											<Button type="primary" size="large" onClick={this.handleSubmit} >确认发货</Button>
										</Row>);
									}
								}
							}
						})())}
					</Row>
				);
			}
		};

		//物流信息--待归还
		const renderGoodsLeaseDistribution = () => {
			const { SendGoodsAction } = this.state;
			if (SendGoodsAction) {
				return (
					<Row style={{ paddingTop: 20 }} >
						{/*物流信息*/}
						{OrLogisticsListNode}
						<OrderLogisticsList orderLogisticsListInfo={this.state.orderLogisticsListInfo} />
						<Row>
							&nbsp;
						</Row>

						{/*待归还*/}
						{
							((() => {
								if (this.state.step != 3 ) {
									if (this.state.self!=2) {
										return (<Row>
											<Col span={24}>
												{BackGoodsNode}
											</Col>
											<Col span={24}>
												<OrderReturn  leaseWorkerInfo={leaseWorkerInfo} />
											</Col>
										</Row>);
									}
								}
							})())
						}

						{
							((() => {
								if (this.state.self==2) {
									return (<Row>
										{OrderGoodsNode}
										{selfGoodsWay('已提取')}
									</Row>);
								}
							})())
						}
						{/*{this.state.step != 3 ?:(<Row>
						 <Col span={24}>

						 {BackGoodsNode}
						 </Col>

						 <Col span={24}>
						 <OrderReturn  leaseWorkerInfo={leaseWorkerInfo} />
						 </Col>
						 </Row>) ''}*/}



						{
							((() => {
								if (this.state.step==6) {
									if (!this.state.refresh) {
										return (<Row>
											{RemarkNode}
											<OrderRemark  getTextareaValue={this.getTextareaValue} inspectionList={this.state.inspectionList} />
										</Row>);
									}
								}
							})())
						}


						{
							((() => {

								if (this.state.self!==2) {
									if (this.state.step==6) {
										if (!this.state.refresh) {
											return (<Row style={{ textAlign: 'center', padding: '50px' }} >
												<Button type="primary" size="large" onClick={this.goodsBackSucessSubmit} >确认收货</Button>
											</Row>);
										}
									} else if (this.state.step !=3) {
										return (<Row style={{ textAlign: 'center', padding: '50px' }} >
											<Button type="primary" size="large" onClick={this.remindBackSubmit} >提醒租凭人归还</Button>
										</Row>);
									}
								}


							})())
						}


					</Row>
				);
			}
		};

		const renderGoodsReturn = () => {
			//11; //已确认付款/待自提  12; //已取消/待退款 13; //退款审核通过/退款中 14; //已退款/结束
			const { ReturnGoodsAction,leaseWorkerInfo,inspectionList,orderKindStatus } = this.state;
			// console.log('leaseWorkerInfo___________________ding________________0:',leaseWorkerInfo);

			const { remainDay,overdueAmount }=leaseWorkerInfo||{};
			const overDueInfo={
				remainDay,
				overdueAmount
			};

			//自提
			if (this.state.self==2) {
				if (orderKindStatus==11) {
					return (
						<div>
							{ OrderGoodsNode }
							{ selfGoodsWay('已确认付款,待自提') }
						</div>
					);
				} else if (orderKindStatus==12 || orderKindStatus==0) {
					return (
						<div>
							{ OrderGoodsNode }
							{ selfGoodsWay('已取消,待退款') }
							{cancelResult(this.state.orderCloseId)}
							<Row style={{ textAlign: 'center', padding: '50px' }} >
								<Button type="primary" size="large" onClick={this.submitReturnPay} >确认退款</Button>
							</Row>
						</div>
					);
				} else if (orderKindStatus==13) {
					return (
						<div>
							{ OrderGoodsNode }
							{ selfGoodsWay('退款审核通过,退款中') }
						</div>
					);
				} else if (orderKindStatus==14) {
					return (
						<div>
							{ OrderGoodsNode }
							{ selfGoodsWay('已退款/结束') }
							{this.RemarkHaveBackNode()}
							{cancelResult(this.state.orderCloseId)}


						</div>
					);
				}  else if (orderKindStatus==0) {
					return (
						<div>
							{ OrderGoodsNode }
							{ selfGoodsWay('取消/交易关闭') }
						</div>
					);
				} else if (orderKindStatus==6) {
					return (
						<div>
							{ OrderGoodsNode }
							{ selfGoodsWay('已归还,待验收') }
							{ overdue(overDueInfo) }
							<Row style={{ textAlign: 'center', padding: '50px' }} >
								<Button type="primary" size="large" onClick={this.goodsBackSucessSubmit} >确认收货</Button>
							</Row>
						</div>
					);
				} else if (orderKindStatus==7) {
					return (
						<div>
							{ OrderGoodsNode }
							{ selfGoodsWay('已验收,待赔偿') }
							{ overdue(overDueInfo) }

						</div>
					);
				}

			}

			//物流
			if (this.state.self!==2) {

				console.log('ReturnGoodsAction_____fafds____________', ReturnGoodsAction);


				if (ReturnGoodsAction) {
					return (
						<Row style={{ paddingTop: 20 }} >
							{
								((() => {
									if ( this.state.step==0) {
										return null;
									} else {
										return (<div>{/*物流信息*/}
											{OrLogisticsListNode}
											<OrderLogisticsList orderLogisticsListInfo={this.state.orderLogisticsListInfo} />

											<Row>
												&nbsp;
											</Row>
											<Row>
												{/*待归还标题*/}
												<Col span={24}>
													{BackGoodsNode}
												</Col>
												<Col span={24}>
													<OrderReturn leaseWorkerInfo={leaseWorkerInfo} />
												</Col>
											</Row></div>);
									}
								})())
							}
							{
								((() => {

									if (this.state.step==6) {
										if (!this.state.refresh) {
											return (<Row>
												{RemarkNode}
												<OrderRemark  getTextareaValue={this.getTextareaValue} inspectionList={this.state.inspectionList} />
											</Row>);
										} else {
											return this.RemarkHaveBackNode();
										}
									} else if (this.state.step==8) {
										return this.RemarkHaveBackNode();
									} else if (this.state.step==12) {
										return (<div>
											{this.RemarkHaveBackNode()}
											{ OrderGoodsNode }
											{ selfGoodsWay('已取消,待退款') }
											{cancelResult(this.state.orderCloseId)}
											<Row style={{ textAlign: 'center', padding: '50px' }} >
												<Button type="primary" size="large" onClick={this.submitReturnPay} >确认退款</Button>
											</Row>
										</div>);
									}

									else if (this.state.step==14) {
										return (<div>
											{this.RemarkHaveBackNode()}
											{ OrderGoodsNode }
											{ selfGoodsWay('已退款/结束') }
											{cancelResult(this.state.orderCloseId)}

										</div>);
									}


								})())
							}

							{
								((() => {
									if (ReturnGoodsAction.returnStatus == 6) {
										if (!this.state.refresh) {
											return (<Row style={{ textAlign: 'center', padding: '50px' }} >
												<Button type="primary" size="large" onClick={this.goodsBackSucessSubmit} >确认收货</Button>
											</Row>);
										}
									}
								})())
							}

						</Row>
					);
				}
			}

			if (this.state.self==2) {
				return (
					<div>
						{ OrderGoodsNode }
						{ selfGoodsWay('已提取') }
					</div>
				);
			}



		};

		return (<div className="order-detail-page" >
			<Row>
				<Col span={24} >
					<h3 style={{ fontSize: '36px', marginBottom: '20px' }} >查看订单 / All Orders</h3>
				</Col>
				<Col span={24} >
					订单号：{leaseWorkerInfo && leaseWorkerInfo.orderId ? leaseWorkerInfo.orderId: ''}
				</Col>
				<Col span={24} style={{ paddingTop: 40  }} >
					<Link
						className="ant-btn"
						style={{ lineHeight: '25px' }}
						onClick={() => {
							const {  params } = this.props;
							console.log('params.step', params.step);
							 this.context.router.push(params.step);
						}
						}
					>
						<Icon type="backward" />
						<span>&nbsp;&nbsp;返回</span>
					</Link>
				</Col>
				<Col span={24} style={{ minHeight: 300 }} >
					<OrderStep
						step={this.state.realStep}
						stepStr={this.state.stepStr}
						sendGoodsSucessState={this.state.sendGoodsSucessState}
						backGoodsSucessState={this.state.backGoodsSucessState}
						self={this.state.self}
						orderKindStatus={this.state.orderKindStatus}
					/>
				</Col>
			</Row>

			<Row style={{ paddingTop: 0 }} >
				<Col span={24} >
					<div className="title" >租凭人信息</div>
				</Col>
			</Row>
			<Row style={{ paddingTop: 0 }} >&nbsp;</Row>
			<Row style={{ paddingTop: 0 }} >
				<LeaseInformation
					orderItemList={this.state.orderItemList}
					leaseWorkerInfo={leaseWorkerInfo}
					allGoodsAction={allGoodsAction}
					creditInfoData={creditInfoData}
					memberzmScore={this.state.memberzmScore}


				/>
			</Row>
			<Row style={{ paddingTop: 0 }} >
				<Col span={24} >
					<div className="title" >支付与配送</div>
				</Col>
			</Row>
			<Row style={{ paddingTop: 20 }} >
				<PaymentDistribution
					leaseWorkerInfo={leaseWorkerInfo}
					self={this.state.self}
				/>
			</Row>
			<Row style={{ paddingTop: 0 }} >
				<Col span={24} >
					<div className="title" >订单清单</div>
				</Col>
			</Row>
			<Row style={{ paddingTop: 20 }} >
				<OrderDetailList OrderInfoList={this.state.orderItemList}  />
			</Row>
			{
				((() => {
					console.log('this.state.step_____________in render______________:', this.state.step);
					if (this.state.step==1) {
					 return leaseWorkerInfo && leaseWorkerInfo.orderStatus ? renderOrderAllDistribution() : '';
					 } else if (this.state.step==2) {
						return leaseWorkerInfo && leaseWorkerInfo.orderStatus ? renderOrderAllDistribution() : '';
					 } else if (this.state.step==3 ) {
						return leaseWorkerInfo && leaseWorkerInfo.orderStatus ? renderOrderAllDistribution() : '';
					} else if (this.state.step==4 ) {
						return leaseWorkerInfo && leaseWorkerInfo.orderStatus ? renderGoodsLeaseDistribution() : '';
					} else if (this.state.step==5) {
						return leaseWorkerInfo && leaseWorkerInfo.orderStatus ? renderGoodsLeaseDistribution() : '';
					} else if (this.state.step==6) {
							 return leaseWorkerInfo && leaseWorkerInfo.orderStatus ? renderGoodsReturn() : '';
					 } else if (this.state.step==8) {
						return leaseWorkerInfo && leaseWorkerInfo.orderStatus ? renderGoodsReturn() : '';
					} else if (this.state.step==0|| this.state.step==12 ) {
						return leaseWorkerInfo && leaseWorkerInfo.orderStatus ? renderGoodsReturn() : '';
					} else if (this.state.step==11||  this.state.step==13 || this.state.step==14 ) {
						return leaseWorkerInfo && leaseWorkerInfo.orderStatus ? renderGoodsReturn() : '';
					}
				})())
			}


		</div>);
	}
}

const mapStateToProps = (state) => {
	const { currentUser } =state.get('AuthService').toObject();
	const stateObje = {
		...state.get('RootService').toObject(),
		...state.get('OrderDetailReducer').toObject(),
		currentUser
	};
	return stateObje;
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			dealOrderDetailInfo,
			qryOrderAll,
			BackGoodsHandleSubmit,
			OrderNoticeReturn,
			OrderCancelReturnPay
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderAdminDetail);
