'use strict';

import { statusNumToClass,statusNumToText,chipNumToText,worksTypeNumToText } from 'utils/MappingUtil';

const columns =  {};
export default columns;

columns.allPayListColumns = [
	{
		title: '申请人',
		dataIndex: 'name',
		key: 'name',
	}, {
		title: '日期',
		dataIndex: 'time',
		key: 'time',
	},{
		title: '备注',
		dataIndex: 'remark',
		key: 'remark',
	}, {
		title: '申请金额',
		dataIndex: 'appMoney',
		key: 'appMoney',
	},{
		title: '状态',
		dataIndex: 'status',
		key: 'status',
	},{
		title: '操作',
		dataIndex: 'action',
		key: 'action',
	}];







columns.pendingListColumns = [
	{
		title: '申请人',
		dataIndex: 'name',
		key: 'name',
	}, {
		title: '日期',
		dataIndex: 'time',
		key: 'time',
	},{
		title: '备注',
		dataIndex: 'remark',
		key: 'remark',
	}, {
		title: '申请金额',
		dataIndex: 'appMoney',
		key: 'appMoney',
	},{
		title: '状态',
		dataIndex: 'status',
		key: 'status',
	},{
		title: '操作',
		dataIndex: 'action',
		key: 'action',
	}];














columns.finishListColumns = [
	{
		title: '申请人',
		dataIndex: 'name',
		key: 'name',
	}, {
		title: '日期',
		dataIndex: 'time',
		key: 'time',
	},{
		title: '备注',
		dataIndex: 'remark',
		key: 'remark',
	}, {
		title: '申请金额',
		dataIndex: 'appMoney',
		key: 'appMoney',
	},{
		title: '状态',
		dataIndex: 'status',
		key: 'status',
	},{
		title: '操作',
		dataIndex: 'action',
		key: 'action',
	}];













