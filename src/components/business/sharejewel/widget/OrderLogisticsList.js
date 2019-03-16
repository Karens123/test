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

export default class OrderLogisticsList extends React.Component {
	//检验类型
	static contextTypes = {
		orderLogisticsListInfo: PropTypes.object.isRequired
	};

	static propTypes = {
		orderLogisticsListInfo: PropTypes.object.isRequired
	};

	static defaultProps = {
		orderLogisticsListInfo: {}
	};

	constructor (props) {
		super(props);
		this.state = {
		};
	}


	//分页控制
	render () {


		const columns = [
			{
				title: '配送物流',
				dataIndex: 'bussinessName',
				key: 'bussinessName',
			}, {
				title: '物流单号',
				dataIndex: 'logisticsTradeNo',
				key: 'logisticsTradeNo',
			},{
				title: '收货地址',
				dataIndex: 'receiverAddress',
				key: 'receiverAddress',
			}, {
				title: '收货方',
				dataIndex: 'receiverName',
				key: 'receiverName',
			},{
				title: '类型',
				dataIndex: 'logisticsType',
				key: 'logisticsType',
			},{
				title: '状态',
				dataIndex: 'state',
				key: 'state',
			},{
				title: '操作',
				dataIndex: 'action',
				key: 'action',
			}];


		const { orderLogisticsListInfo } = this.props;
		const TableItem=[];
		if (orderLogisticsListInfo.length !==0) {
			for ( const nodeElement of orderLogisticsListInfo) {
				TableItem.push(<Table
					dataSource={[nodeElement]}
					columns={columns}
					pagination={false}
				/>);
			}

		} else {
			return (<div style={{ padding: 10 }}>暂无数据</div>);
		}

		return (<div className="OrderLogisticsListInfo">
			{TableItem}
		</div>);
	}
}
