'use strict';

import React, { PropTypes } from 'react';
import {  Pagination,Table } from 'antd';

export default class PendingAdultForm extends React.Component{
	static propTypes = {
		data: PropTypes.object.isRequired,
		pageChangeHandler: PropTypes.func.isRequired,
	};

	render(){
		const { data,pageChangeHandler } = this.props;
		const { currentPage,totalCount,records } = data;
		const showData= records;

		const pendingAdultColumns = [
			{
				title: '需求名称',
				dataIndex: 'productName',
				key: 'productName',
			}, {
				title: '需求方',
				dataIndex: 'publisher',
				key: 'publisher',
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
				dataIndex: 'reward',
				key: 'reward',
			},{
				title: '签约类型',
				dataIndex: 'demandContractBean',
				key: 'demandContractBean',
			},{
				title: '状态',
				dataIndex: 'state',
				key: 'state',
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