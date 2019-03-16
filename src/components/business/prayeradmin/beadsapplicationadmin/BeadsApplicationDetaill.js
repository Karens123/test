'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import businessRoute from 'business/route';
import { Col, Row, Table, Tabs, Select, Pagination, Modal, Input, Form, Icon } from 'antd';
import * as DateUtil from 'src/utils/DateUtil';
import { parseDateTime,getDiffDayFromNow } from 'utils/DateUtil';
import { purchaseOrderDetaillData,finishBeads } from '../dataConfig';


class BeadsApplicationDetail extends  React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		params: PropTypes.object,
	};

	static defaultProps = {
		params: {},
		form: {},
		allOrderListData: []
	};

	componentWillMount() {
		const { params } = this.props;


	}

	render(){
		const TabPane = Tabs.TabPane;
		const { params } = this.props;
		const { orderId } = params;

		const allPayListColumns = [
			{
				title: '佛珠序列号',
				dataIndex: 'BeadsId',
				key: 'BeadsId',
			}
			,{
				title: '布施用户id',
				dataIndex: 'userid',
				key: 'userid',
			}
		];
		return (<div className="order-detail-page buy-order-admin" >
			<Col span={24} >
				<h3 style={{ fontSize: '36px', marginBottom: '20px' }} >查看订单 </h3>
			</Col>
			<Col span={24} >
				订单号：{orderId && orderId ? orderId :''}
			</Col>

			<Col span={24} style={{ paddingTop: 40  }} >
				<Link
					className="ant-btn"
					style={{ lineHeight: '25px' }}
					onClick={() => {
						const { params } = this.props;
						const { dataType,fileType,page } = params;
						const url=`${businessRoute.purchaseOrderAdmin}/${page}/${fileType}/${dataType}`;
						this.context.router.push(url);
					}
					}
				>
					<Icon type="backward" />
					<span>&nbsp;&nbsp;返回</span>
				</Link>

				<Col span={24} style={{ height: 25 }} >
					 &nbsp;
				</Col>

				<div className="order-info">
					<Row style={{ paddingTop: 0 }} >
						<Col span={24} >
							<div className="title" >订单信息</div>
						</Col>
					</Row>
					<Col span={24} style={{ height: 25 }} >
						&nbsp;
					</Col>
					<Row style={{ paddingTop: 0 }} >
						<Col span={8} >
							用户id: {purchaseOrderDetaillData.usersId}
						</Col>
						<Col span={8} >
							下单时间: {DateUtil.parseDate(purchaseOrderDetaillData.orderTime)}
						</Col>
						<Col span={8} >
							购买金额:{purchaseOrderDetaillData.Amount}
						</Col>
					</Row>
					<Row style={{ paddingTop: 0 }} >
						<Col span={8} >
							付款时间: {purchaseOrderDetaillData.orderTime}
						</Col>
						<Col span={8} >
							购买数量: {purchaseOrderDetaillData.cnt}
						</Col>
						<Col span={8} >
							收货电话: {purchaseOrderDetaillData.tel}
						</Col>
					</Row>
					<Row style={{ paddingTop: 0 }} >
						<Col span={8} >
							收货地址: {purchaseOrderDetaillData.addres}
						</Col>
						<Col span={8} >
							收货名称: {purchaseOrderDetaillData.goodName}
						</Col>
						<Col span={8} >
							订单状态: {purchaseOrderDetaillData.orderState}
						</Col>
					</Row>
				</div>


				<br /><br /><br />
				<div className="order-info" >
					<Col span={24}  style={{ height: '50px' }} >
						&nbsp;
					</Col>

					<Col span={24} >
						<div className="title" style={{ borderTop: 'solid 1px #ddd' }} >已完成申领佛珠列表</div>
					</Col>


					<Col span={24} >
						<Table
							dataSource={finishBeads}
							columns={allPayListColumns}
							pagination={false}
							rowKey={record => record.id}
							onRowClick={this.handleRowClk}
						/>
					</Col>
				</div>

			</Col>
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
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(BeadsApplicationDetail);
