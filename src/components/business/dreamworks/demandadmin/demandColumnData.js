'use strict';

import { statusNumToClass,statusNumToText,chipNumToText,worksTypeNumToText,contractTypeNumToClass } from 'utils/MappingUtil';

const columns =  {};
export default columns;




columns.PendingAuditColumns = [
	{
		title: '需求名',
		dataIndex: 'productName',
		key: 'productName',
		width: '200px',
		render: (text, item) => `${item.productName}`,
	},{
		title: '需求方',
		dataIndex: 'publisher',
		key: 'publisher',
		width: '200px',
	}, {
		title: '芯片',
		dataIndex: 'chip',
		key: 'chip',
		width: '200px',
	}, {
		title: '类型',
		dataIndex: 'type',
		key: 'type',
		width: '100px',
		render: (text, item) => {
			return worksTypeNumToText(item.type);
		},
	}, {
		title: '工期(天)',
		dataIndex: 'timeLimit',
		key: 'timeLimit',
		width: '100px',
	}, {
		title: '总金额',
		dataIndex: 'reward',
		key: 'reward',
		width: '100px',
	},
	{
		title: '状态',
		dataIndex: 'state',
		key: 'state',
		width: '200px',
	},{
		title: '操作',
		dataIndex: 'opr',
		key: 'opr',
		width: '100px',
	}
];



columns.allDemandColumns = [
	{
		title: '需求名',
		dataIndex: 'productName',
		key: 'productName',
		width: '200px',
		render: (text, item) => `${item.productName}`,
	},{
		title: '需求方',
		dataIndex: 'publisher',
		key: 'publisher',
		width: '200px',
	}, {
		title: '芯片',
		dataIndex: 'chip',
		key: 'chip',
		width: '200px',
	}, {
		title: '类型',
		dataIndex: 'type',
		key: 'type',
		width: '100px',
		render: (text, item) => {
			return worksTypeNumToText(item.type);
		},
	}, {
		title: '工期(天)',
		dataIndex: 'timeLimit',
		key: 'timeLimit',
		width: '100px',
	}, {
		title: '总金额',
		dataIndex: 'reward',
		key: 'reward',
		width: '100px',
	},
	{
		title: '己支付',
		dataIndex: 'contractDeposit',
		key: 'contractDeposit',
		width: '100px',
	},
	{
		title: '委托类型',
		dataIndex: 'contractType',
		key: 'contractType',
		width: '100px',
	},{
		title: '签约人',
		dataIndex: 'designer',
		key: 'designer',
		width: '100px',
	},
	{
		title: '状态',
		dataIndex: 'state',
		key: 'state',
		width: '200px',
	},{
		title: '操作',
		dataIndex: 'opr',
		key: 'opr',
		width: '100px',
	}];




columns.offDemandColumns = [
	{
		title: '需求名',
		dataIndex: 'productName',
		key: 'productName',
		width: '200px',
		render: (text, item) => `${item.productName}`,
	},{
		title: '需求方',
		dataIndex: 'publisher',
		key: 'publisher',
		width: '200px',
	}, {
		title: '芯片',
		dataIndex: 'chip',
		key: 'chip',
		width: '200px',
	}, {
		title: '类型',
		dataIndex: 'type',
		key: 'type',
		width: '100px',
		render: (text, item) => {
			return worksTypeNumToText(item.type);
		},
	}, {
		title: '工期(天)',
		dataIndex: 'timeLimit',
		key: 'timeLimit',
		width: '100px',
	}, {
		title: '总金额',
		dataIndex: 'reward',
		key: 'reward',
		width: '100px',
	},{
		title: '状态',
		dataIndex: 'state',
		key: 'state',
		width: '200px',
	},{
		title: '操作',
		dataIndex: 'opr',
		key: 'opr',
		width: '100px',
	}];




columns.pendingContractColumns = [
	{
		title: '需求名',
		dataIndex: 'productName',
		key: 'productName',
		width: '200px',
		render: (text, item) => `${item.productName}`,
	},{
		title: '需求方',
		dataIndex: 'publisher',
		key: 'publisher',
		width: '200px',
	}, {
		title: '芯片',
		dataIndex: 'chip',
		key: 'chip',
		width: '200px',
	}, {
		title: '类型',
		dataIndex: 'type',
		key: 'type',
		width: '100px',
		render: (text, item) => {
			return worksTypeNumToText(item.type);
		},
	}, {
		title: '工期(天)',
		dataIndex: 'timeLimit',
		key: 'timeLimit',
		width: '100px',
	}, {
		title: '总金额',
		dataIndex: 'reward',
		key: 'reward',
		width: '100px',
	},{
		title: '状态',
		dataIndex: 'state',
		key: 'state',
		width: '200px',
	},{
		title: '操作',
		dataIndex: 'opr',
		key: 'opr',
		width: '100px',
	}];




columns.InProcessColumns = [
	{
		title: '需求名',
		dataIndex: 'productName',
		key: 'productName',
		width: '200px',
		render: (text, item) => `${item.productName}`,
	},{
		title: '需求方',
		dataIndex: 'publisher',
		key: 'publisher',
		width: '200px',
	}, {
		title: '芯片',
		dataIndex: 'chip',
		key: 'chip',
		width: '200px',
	}, {
		title: '类型',
		dataIndex: 'type',
		key: 'type',
		width: '100px',
		render: (text, item) => {
			return worksTypeNumToText(item.type);
		},
	}, {
		title: '工期(天)',
		dataIndex: 'timeLimit',
		key: 'timeLimit',
		width: '100px',
	}, {
		title: '总金额',
		dataIndex: 'reward',
		key: 'reward',
		width: '100px',
	},{
		title: '己支付',
		dataIndex: 'contractDeposit',
		key: 'contractDeposit',
		width: '200px',
	},{
		title: '委托类型',
		dataIndex: 'contractType',
		key: 'contractType',
		width: '200px',
	},{
		title: '状态',
		dataIndex: 'state',
		key: 'state',
		width: '200px',
	},{
		title: '操作',
		dataIndex: 'opr',
		key: 'opr',
		width: '100px',
	}];



columns.finishedColumns = [
	{
		title: '需求名',
		dataIndex: 'productName',
		key: 'productName',
		width: '200px',
		render: (text, item) => `${item.productName}`,
	},{
		title: '需求方',
		dataIndex: 'publisher',
		key: 'publisher',
		width: '200px',
	}, {
		title: '芯片',
		dataIndex: 'chip',
		key: 'chip',
		width: '200px',
	}, {
		title: '类型',
		dataIndex: 'type',
		key: 'type',
		width: '100px',
		render: (text, item) => {
			return worksTypeNumToText(item.type);
		},
	}, {
		title: '工期(天)',
		dataIndex: 'timeLimit',
		key: 'timeLimit',
		width: '100px',
	}, {
		title: '总金额',
		dataIndex: 'reward',
		key: 'reward',
		width: '100px',
	},{
		title: '状态',
		dataIndex: 'state',
		key: 'state',
		width: '200px',
	},{
		title: '操作',
		dataIndex: 'opr',
		key: 'opr',
		width: '100px',
	}];