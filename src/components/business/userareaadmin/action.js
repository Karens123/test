'use strict';

import * as HttpUtil from 'utils/HttpUtil';

//1.系统新闻
export const SYSTREM_MESSAGES = 'SYSTREM_MESSAGES';
//2.新用户
export const SYSTREM_NEW_USERS = 'SYSTREM_NEW_USERS';
//3.近30日用户走势图
export const NEW_USER_CHART = 'NEW_USER_CHART';
//4.统计分析首页-新增用户tab
export const NEW_USER_ADD_USERS = 'NEW_USER_ADD_USERS';
//5.用户整体统计分析
export const USERS_WHOLE_STATISTIC = 'USERS_WHOLE_STATISTIC';
//6.新增新用户
export const USERS_NEW_ADD = 'USERS_NEW_ADD';
//7.新增新用户
export const STAT_ACTIVE_USER = 'STAT_ACTIVE_USER';

//8.硬件统计
export const HARWARE_CONT_STAISTIC = 'HARWARE_CONT_STAISTIC';

//9.硬件连接明细查询接口
export const HARWARE_CONNCENT_DEATIL = 'HARWARE_CONNCENT_DEATIL';



//1. 系统新闻
export function sysMsg () {
	return {
		type: SYSTREM_MESSAGES,
		payload: {
			promise: HttpUtil.ExpressApi.post('/sysMsg', {
				data: {
					test: '0',
					test1: '1',
				},
			}),
		},
	};
}

//2. 新用户
export function newUsers () {
	return {
		type: SYSTREM_NEW_USERS,
		payload: {
			promise: HttpUtil.ExpressApi.post('/newUsers'),
		},
	};
}

//3. 近30日用户走势图
export function usersChart () {
	return {
		type: NEW_USER_CHART,
		payload: {
			promise: HttpUtil.ExpressApi.post('/usersChart'),
		},
	};
}

//4. 统计分析首页新增用户tab
export function usersPieData () {
	return {
		type: NEW_USER_ADD_USERS,
		payload: {
			promise: HttpUtil.ExpressApi.post('/usersPieData'),
		},
	};
}

//5.用户整体统计分析
export function userWholeStatistic () {
	return {
		type: USERS_WHOLE_STATISTIC,
		payload: {
			promise: HttpUtil.ExpressApi.post('/useWholeStatistic'),
		},
	};
}

//6.新增新用户
export function addNewUser () {
	return {
		type: USERS_NEW_ADD,
		payload: {
			promise: HttpUtil.ExpressApi.post('/statNewUser'),
		},
	};
}

//7.活跃新用户
export function statActiveUser () {
	return {
		type: STAT_ACTIVE_USER,
		payload: {
			promise: HttpUtil.ExpressApi.post('/statActiveUser'),
		},
	};
}



//8.硬件统计
export function qryHardwareByForm (qryBean = {}) {
	return {
		type: HARWARE_CONT_STAISTIC,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/statBusiConnect', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					beginTime: qryBean.beginTime,
					endTime: qryBean.endTime,
					qryBean
				},
			}),
		},
	};
}


//9.硬件连接明细查询接口
export function qryBusiConnect (qryBean = {}) {
	return {
		type: HARWARE_CONNCENT_DEATIL,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/qryBusiConnect', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					beginTime: qryBean.beginTime,
					endTime: qryBean.endTime,
					record: {
						bindResult: qryBean.record.bindResult,
					}
				},
			}),
		},
	};
}
