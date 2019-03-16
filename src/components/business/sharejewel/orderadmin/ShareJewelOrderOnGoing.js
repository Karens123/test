'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Col, Row, Table, Tabs, Select, Pagination, Modal, Input, Form, Icon } from 'antd';

export default class ShareJewelOrderOnGoing extends  React.Component {
	static propTypes = {
		tableType: PropTypes.string.isRequired,
		dataSource: PropTypes.array.isRequired,
		columns: PropTypes.array.isRequired,
		activePage: PropTypes.number.isRequired,
		total: PropTypes.number.isRequired,
		renderPagination: PropTypes.func.isRequired,
		filter: PropTypes.string.isRequired,
		renderFilter: PropTypes.func.isRequired,
		showDataTypeHandler: PropTypes.func.isRequired
	};
	render(){
		const { tableType,dataSource,columns,activePage,total,renderPagination,filter,renderFilter,showDataTypeHandler } =this.props;
		const TabPane = Tabs.TabPane;
		return (<div>
			{renderFilter(filter)}
			<Tabs defaultActiveKey={tableType} onChange={showDataTypeHandler} >
				<TabPane tab="全部" key="1" >
					<Table dataSource={dataSource} columns={columns} pagination={false} />
					{renderPagination(activePage,total)}
				</TabPane>
				<TabPane tab="租赁中" key="2" >
					<Table dataSource={dataSource} columns={columns} pagination={false} />
					{renderPagination(activePage,total)}
				</TabPane>
				<TabPane tab="已逾期" key="3" >
					<Table dataSource={dataSource} columns={columns} pagination={false} />
					{renderPagination(activePage,total)}
				</TabPane>
			</Tabs>
		</div>);
	}
}