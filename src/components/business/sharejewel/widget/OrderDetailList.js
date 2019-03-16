'use strict';

import React, { PropTypes } from 'react';
import { Col, Row, Table, Tabs, Select, Pagination, Modal, Input, Form, Icon } from 'antd';
import { parseDate, parseDateTime } from 'utils/DateUtil';

const { TextArea } = Input;

export default class OrderDetailList extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired,
		OrderInfoList: PropTypes.object.isRequired,
		changeShopInfo: PropTypes.object.isRequired,
	};

	static propTypes = {
		OrderInfoList: PropTypes.array,
		changeShopInfo: PropTypes.object,
	};

	static defaultProps = {
		params: {},
		form: {},
		OrderInfoList: [],
		changeShopInfo: {}
	};

	constructor (props) {
		super(props);
		this.state = {
			showModal: false,
			leaseWorkerInfo: {},
			changeShopInfo: {}
		};
	}

	//Table行选择事件
	handleRowClk = (records) => {
		console.log('records', records);
		this.setState({
			selectedRowKeys: [records.recId],
		});
	};

	//分页控制
	render () {

		const columns = [
			{
				title: '订单号',
				dataIndex: 'orderId',
				key: 'orderId',
			}, {
				title: '商品/名称',
				dataIndex: 'shopName',
				key: 'shopName',
				width: 300
			},{
				title: '商品价格',
				dataIndex: 'goodsSalePrice',
				key: 'goodsSalePrice',
			},{
				title: '原日租',
				dataIndex: 'dailyRents',
				key: 'dailyRents',
			},{
				title: '租赁天数',
				dataIndex: 'leaseTime',
				key: 'leaseTime',
			},{
				title: '活动日租',
				dataIndex: 'discountRents',
				key: 'discountRents',
			},{
				title: '原租金',
				dataIndex: 'salePrice',
				key: 'salePrice',
			},
			{
				title: '租购数量',
				dataIndex: 'goodsNum',
				key: 'goodsNum',
			},
			{
				title: '活动租金',
				dataIndex: 'discountPrice',
				key: 'discountPrice',
			},

		];

		const chageShopsColumns = [
			{
				title: '订单号',
				dataIndex: 'orderId',
				key: 'orderId',
			}, {
				title: '商品/名称',
				dataIndex: 'goodsName',
				key: 'goodsName',
				width: 300
			}, {
				title: '原日租',
				dataIndex: 'goodsSalePrice',
				key: 'goodsSalePrice',
			}, {
				title: '实际日租',
				dataIndex: 'discountRents',
				key: 'discountRents',
			},  {
				title: '租赁天数',
				dataIndex: 'leaseTime',
				key: 'leaseTime',
			}, {
				title: '实付',
				dataIndex: 'dueAmount',
				key: 'dueAmount',
				render: (text) => {
					return <span className="red" >￥{text}</span>;
				}
			}, {
				title: '状态',
				dataIndex: 'state',
				key: 'state',
			}, {
				title: '操作',
				dataIndex: 'action',
				key: 'action',
			}];
		const { OrderInfoList, changeShopInfo } = this.props;
		return (<div >{
			 OrderInfoList ? OrderInfoList.map((item,index) => {
			 return (
				 <Table
					 columns={columns}
					 rowKey={record => record.orderId}
					 onRowClick={this.handleRowClk}
					 dataSource={[item]}
					 pagination={false}

				 />
			 );
			}) :'暂无数据'
		}
			{
				changeShopInfo && changeShopInfo.orderId ? (<Table
					columns={chageShopsColumns}
					rowKey={record => record.orderId}
					onRowClick={this.handleRowClk}
					dataSource={[changeShopInfo]}
					pagination={false}
				/>) : ' '
			}

		</div>);
	}
};

