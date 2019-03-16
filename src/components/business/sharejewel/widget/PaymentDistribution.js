'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Col, Row, Table, Tabs, Select, Pagination, Modal, Input, Form, Icon } from 'antd';
import { parseDate, parseDateTime } from 'utils/DateUtil';
import * as MappingUtil from 'utils/MappingUtil';

const Option = Select.Option;
const { TextArea } = Input;

export default class PaymentDistribution  extends React.Component {
	//检验类型
	static contextTypes = {
		leaseWorkerInfo: PropTypes.object.isRequired,

	};

	static propTypes = {
		leaseWorkerInfo: PropTypes.object.isRequired,
		self: PropTypes.number.isRequired
	};

	static defaultProps = {
		leaseWorkerInfo: {},
	};

	constructor (props) {
		super(props);
		this.state = {
			showModal: false,
		};
	}

	renderDistributionWay = (leaseWorkerInfo,self) => {
		return self && self==2 ? `${leaseWorkerInfo.address}(自提)`: self==1?`${leaseWorkerInfo.address} (快递)`: self==0?'不配送': '';
	};

	//分页控制
	render () {
		const { leaseWorkerInfo,self } = this.props;
		const distributionWay=this.renderDistributionWay(leaseWorkerInfo,self);
		return (<div className="order-info">
			<Row >
				<Col span={8} >
					配送方式：{distributionWay}
				</Col>
				<Col span={8} >
					运费：{`￥${leaseWorkerInfo.freight}`}
				</Col>
				<Col span={8} >
					支付方式：{leaseWorkerInfo.payType==0 ? '支付宝': leaseWorkerInfo.payType==1? '微信': leaseWorkerInfo.payType==2? '钱包': ''}
				</Col>
			</Row>
			<Row >
				<Col span={8} >
					实付金额：<span className="red">￥{leaseWorkerInfo.dueAmount}</span>
				</Col>
				<Col span={8} >
					优惠金额：￥{leaseWorkerInfo.couponAmount}
				</Col>
				<Col span={8} >
					收货人：{leaseWorkerInfo.receiverName}
				</Col>
			</Row>
			<Row >
				<Col span={8} >
					联系方式：{leaseWorkerInfo.receiverPhone}
				</Col>
				<Col span={0} >
					收货地址：{'广东省广州市番禺区节能科技园1栋901室'}
				</Col>
				<Col span={8} >
					&nbsp;
				</Col>
			</Row>
		</div>);
	}
}
