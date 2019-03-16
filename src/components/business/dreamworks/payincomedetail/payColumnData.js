'use strict';

import { statusNumToClass,statusNumToText,chipNumToText,worksTypeNumToText } from 'utils/MappingUtil';

const columns =  {};
export default columns;

columns.allPayListColumns = [
	{
		title: '时间',
		dataIndex: 'name',
		key: 'name',
	}, {
		title: '编号',
		dataIndex: 'time',
		key: 'time',
	},{
		title: '收入',
		dataIndex: 'remark',
		key: 'remark',
	}, {
		title: '支出',
		dataIndex: 'appMoney',
		key: 'appMoney',
	},{
		title: '操作',
		dataIndex: 'action',
		key: 'action',
	}];







columns.PayincomelistColumns = [
	{
		title: '付款方',
		dataIndex: 'publisher',
		key: 'publisher',
	},
	{
		title: '收款方',
		dataIndex: 'payoff',
		key: 'payoff',
	},
	{
		title: '时间',
		dataIndex: 'time',
		key: 'time',
	}, {
		title: '备注',
		dataIndex: 'remark',
		key: 'remark',
	},{
		title: '操作人',
		dataIndex: 'actionren',
		key: 'actionren',
	}, {
		title: '金额',
		dataIndex: 'reward',
		key: 'reward',
	},{
		title: '操作',
		dataIndex: 'action',
		key: 'action',
	}];










