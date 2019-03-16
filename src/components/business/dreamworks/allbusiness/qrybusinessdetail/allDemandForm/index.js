'use strict';

import React, { PropTypes } from 'react';
import {  Pagination,Table } from 'antd';

export default class AllDemandForm extends React.Component{
	static propTypes = {
		data: PropTypes.object.isRequired,
		pageChangeHandler: PropTypes.func.isRequired,
	};

	render(){
		const { data,pageChangeHandler } = this.props;
		const { currentPage,totalCount,record } = data;
		const showData= record;
		const pendingAdultColumns = [
			{
				title: '需求名称',
				dataIndex: 'name',
				key: 'name',
			}, {
				title: '芯片',
				dataIndex: 'chip',
				key: 'chip',
			}, {
				title: '类型',
				dataIndex: 'type',
				key: 'type',
			},  {
				title: '工期',
				dataIndex: 'timeLimit',
				key: 'timeLimit',
			},  {
				title: '总金额',
				dataIndex: 'money',
				key: 'money',
			},{
				title: '已支付',
				dataIndex: 'payed',
				key: 'payed',
			},{
				title: '委托类型',
				dataIndex: 'delegatType',
				key: 'delegatType',
			},{
				title: '签约人',
				dataIndex: 'designer',
				key: 'designer',
			}, {
				title: '状态',
				dataIndex: 'status',
				key: 'status',
			}, {
				title: '操作',
				dataIndex: 'action',
				key: 'action',
			}];
		return (<div className="pending-audlt-admin">
			<Table
				dataSource={showData}
				columns={pendingAdultColumns}
				pagination={false}
			/>
			<div className="pg-ctr" >
				<Pagination
					defaultCurrent={currentPage}
					current={currentPage}
					total={totalCount}
					onChange={pageChangeHandler}
				/>
			</div>
		</div>);
	}
}