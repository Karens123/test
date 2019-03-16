import React, { PropTypes } from 'react';
import {  Col, Row, Table, Tabs, Select, Pagination,Modal,Input,Form,Icon } from 'antd';

export default class OrderStep extends React.Component{

	static propTypes = {
		step: PropTypes.number.isRequired,
		stepStr: PropTypes.number.isRequired,
		sendGoodsSucessState: PropTypes.bool.isRequired,
		backGoodsSucessState: PropTypes.bool.isRequired,
		self: PropTypes.number.isRequired,
		orderKindStatus: PropTypes.number.isRequired,

	};

	static defaultProps = {
		stepStr: ' ',
		PropTypes: false,
		self: undefined
	};

	getState = (step,state) => {

		if (step==state){
			return 'done';
		} else if (step>state) {
			return 'done overdone';
		}
	};

	renderState = () => {
		const { stepStr,sendGoodsSucessState,self,step,backGoodsSucessState } = this.props;
		if (sendGoodsSucessState==true) {
			return '已发货';
		} else {
			console.log('self___________mystep中_______________________________', self);
			console.log('stepStr_____________________________________________', stepStr);
			if (self==2) { //自提
				if (stepStr=='') { //为空说明stepStr没有付值,是第三步

					if (step==3) {
						return '己提取';
					} else if (step==5||step==6||step==7||step==8) {
						return '己提取';
					}
					else if (step==1||step==2) {
						return '待提取';
					}
					else if (step==11) {
						return '待提取';
					} else if (step==12) {
						return '待退款';
					} else if (step==13) {
						return '退款中';
					} else if (step==14) {
						return '结束';
					}  else if (step==0) {
						return '交易关闭';
					}
				} else if (step==5||step==6||step==7||step==8) {
					return '己提取';
				} else {
					if (step==3) {
						return '已退款';	//stepStr非空，说明是第四步，己付值，但返回还是第三步
					}
				}

			} else if (stepStr=='') {
				if (step==14) {
					return '结束';
				} else {
					return '待发货'; //物流
				}
			} else {
				return this.props.stepStr; //已发货
			}
		}
	};

	render(){
		const { orderKindStatus } = this.props;
		let { step } = this.props;
		if (orderKindStatus==11 ||orderKindStatus==12|| orderKindStatus==13 ||orderKindStatus==14) { //11; //已确认付款/待自提  12; //已取消/待退款 13; //退款审核通过/退款中 14; //已退款/结束
			const stopStep=3;
			step=stopStep;
		}
		return (<div className="setp">
			<div className={`stepbox ${this.getState(step,1)}`} style={{ left: 0 }}>
				<b className="circle">1</b>
				<div className="Vline" style={{ width: 160 }} />
				<span className="checkIcon"><Icon type="check" /></span>
				<p className="text">提交订单</p>
			</div>

			<div className={`stepbox ${this.getState(step,2)}`} style={{ left: 160 }}>
				<b className="circle">2</b>
				<div className="Vline" style={{ width: 160 }} />
				<span className="checkIcon"><Icon type="check" /></span>
				<p className="text">付款成功</p>
			</div>

			<div className={`stepbox ${this.getState(step,3)}`} style={{ left: 320 }}>
				<b className="circle">3</b>
				<div className="Vline" style={{ width: 160 }} />
				<span className="checkIcon"><Icon type="check" /></span>
				<p className="text">{this.renderState()}</p>
			</div>

			<div className={`stepbox ${this.getState(step,4)}`} style={{ left: 480 }}>
				<b className="circle">4</b>
				<div className="Vline" style={{ width: 160 }} />
				<span className="checkIcon"><Icon type="check" /></span>
				<p className="text">确认收货</p>
			</div>

			<div className={`stepbox ${this.getState(step,5)}`} style={{ left: 640 }}>
				<b className="circle">5</b>
				<div className="Vline" style={{ width: 160 }} />
				<span className="checkIcon"><Icon type="check" /></span>
				<p className="text">租赁中</p>
			</div>
			<div className={`stepbox ${this.getState(step,6)}`} style={{ left: 800 }}>
				<b className="circle">6</b>
				<div className="Vline" style={{ width: 160 }} />
				<span className="checkIcon"><Icon type="check" /></span>
				<p className="text">归还中</p>
			</div>

			<div className={`stepbox ${this.getState(step,7)}`} style={{ left: 960 }}>
				<b className="circle">7</b>
				<span className="checkIcon"><Icon type="check" /></span>
				<p className="text">完成</p>
			</div>
		</div>);

	}
}
