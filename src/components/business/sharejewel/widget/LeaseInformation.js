'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Col, Row, Table, Tabs, Select, Pagination, Modal, Input, Form, Icon } from 'antd';
import { parseDate, parseDateTime } from 'utils/DateUtil';
// import './index.less';

const Option = Select.Option;
const { TextArea } = Input;

export default class LeaseInformation extends React.Component {
	//检验类型
	static contextTypes = {
		leaseWorkerInfo: PropTypes.object.isRequired,
		allGoodsAction: PropTypes.object.isRequired,
		creditInfoData: PropTypes.object.isRequired,
		memberzmScore: PropTypes.fun,
		orderItemList: PropTypes.array.isRequired,


	};

	static propTypes = {
		leaseWorkerInfo: PropTypes.object.isRequired,
		allGoodsAction: PropTypes.object.isRequired,
		creditInfoData: PropTypes.object.isRequired,
		memberzmScore: PropTypes.fun,
		orderItemList: PropTypes.array.isRequired,

	};

	static defaultProps = {
		leaseWorkerInfo: {},
		allGoodsAction: {},
		creditInfoData: {},
		orderItemList: [],
		memberzmScore: () => {}
	};

	constructor (props) {
		super(props);
		this.state = {
			showModal: false,
		};
	}
	getSum = (total, num) => {
		return total + num;
	};

	goodsTotailPirce = (orderItemList) => {
		const data = [];
		orderItemList.map((item, index) => {
			const ele = item.goodsSalePrice.split('￥')[1] * 1;
			data.push(ele);
		});

		if (data.length !==0) {
			return `￥${data.reduce(this.getSum)}`;
		}
	};
	//分页控制
	render () {
		const { leaseWorkerInfo,allGoodsAction,creditInfoData,memberzmScore,orderItemList } = this.props;

		const goodsTotailPirceStr=this.goodsTotailPirce(orderItemList);
		return (<div className="order-info">
			<Row >
				<Col span={8} >
					租凭人：{leaseWorkerInfo.leaseName}
				</Col>
				<Col span={8} >
					联系方式：{leaseWorkerInfo.phoneId}
				</Col>
				<Col span={8} >
					租赁天数：{`${leaseWorkerInfo.leaseTime}天`}
				</Col>
			</Row>
			<Row >
				<Col span={8} >
					下单时间：{leaseWorkerInfo.createTime}
				</Col>
				<Col span={8} >
					受信方式：{memberzmScore()}

					{/*{allGoodsAction.orderStatus==2 }
					{creditInfoData && creditInfoData.creditInfo ? `芝麻信用 (${creditInfoData.creditInfo.zmScore})`:''}
*/}
				</Col>
				<Col span={8} >
					商品总价：{goodsTotailPirceStr}
				</Col>
			</Row>
			<Row >
				<Col span={8} >
					{/*原价：{leaseWorkerInfo.totalAmount}*/}
				</Col>
				<Col span={8} >
					{/*实际日租：<span className="red">￥{leaseWorkerInfo.realDaylesaeAmount}</span>*/}
				</Col>
				{allGoodsAction.orderStatus==2 ?<Col span={8} >
					{/*可换次数：{leaseWorkerInfo.memberInfo}*/}
				</Col> :''}

			</Row>
		</div>);
	}
}
