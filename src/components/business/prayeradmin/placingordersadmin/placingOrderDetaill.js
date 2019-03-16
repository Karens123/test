'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import businessRoute from 'business/route';
import { Col, Row, Table, Tabs, Select, Pagination, Modal, Input, Form, Icon } from 'antd';
import * as Immutable from 'immutable';

import { purchaseOrderDetaillData,allOrderListData,RelationData } from '../dataConfig';



class PlacingOrderDetaill extends React.Component {
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

	constructor(props) {
		super(props);
		this.state = {
		};
	}


	componentWillReceiveProps(nextProps,nextState) {

	}



	render () {
		const data=Immutable.Map(purchaseOrderDetaillData);
		console.log('RelationData______________________0____________________', RelationData.records);
		if (data) {
			console.log('data______________________4____________________', data);
		}

		const { params } = this.props;
		const { orderId } = params;

		const allPayListColumns = [
			{
				title: '佛珠序列号',
				dataIndex: 'BeadsId',
				key: 'BeadsId',
			}, {
				title: '用户id',
				dataIndex: 'userid',
				key: 'userid',
			}
		];


		return (<div className="order-detail-page buy-order-admin" >
			<Col span={24} >
				<h3 style={{ fontSize: '36px', marginBottom: '20px' }} >查看订单 </h3>
			</Col>
			<Col span={24} >
				订单号：{orderId && orderId ? orderId : ''}
			</Col>

			<Col span={24} style={{ paddingTop: 40 }} >
				<Link
					className="ant-btn"
					style={{ lineHeight: '25px' }}
					onClick={() => {
						const { params } = this.props;
						const { dataType, fileType, page } = params;
						const url = `${businessRoute.placingOrderAdmin}/${page}/${fileType}/${dataType}`;
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

				<div className="order-info" >
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
							用户id: {data.get('usersId')}
						</Col>
						<Col span={8} >
							下单时间: {data.get('orderTime')}
						</Col>
						<Col span={8} >
							购买金额: {data.get('Amount')}
						</Col>
					</Row>
					<Row style={{ paddingTop: 0 }} >
						<Col span={8} >
							付款时间: {data.get('orderTime')}
						</Col>
						<Col span={8} >
							布施数量: {data.get('cnt')}
						</Col>
						<Col span={8} >
							布施祈愿: {data.get('Praying')}
						</Col>
					</Row>
					<Row style={{ paddingTop: 0 }} >
						<Col span={8} >
							微信号: {data.get('wechat')}
						</Col>
						<Col span={8} >
							布施寺院: {data.get('Monastery')}
						</Col>
						<Col span={8} >
							订单状态: {data.get('orderState')}
						</Col>
					</Row>
				</div>
			</Col>

			<div className="order-info" >
				<Col span={24}  style={{ height: '50px' }} >
					&nbsp;
				</Col>
				<Col span={24} >
					<div className="title" style={{ borderTop: 'solid 1px #ddd' }} >关联分配的用户</div>
				</Col>


				<Col span={24} >
					<Table
						dataSource={RelationData}
						columns={allPayListColumns}
						pagination={false}
						rowKey={record => record.id}
						onRowClick={this.handleRowClk}
					/>
				</Col>
			</div>

		</div>);
	}
};

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

export default connect(mapStateToProps, mapDispatchToProps)(PlacingOrderDetaill);
