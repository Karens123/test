'use strict';

import * as HttpUtil from 'utils/HttpUtil';

//1.统计分析首页-新增用户tab
export const NEW_USER_ADD_USERS = 'NEW_USER_ADD_USERS';

//2.昨日用户增长统计
export const GTE_BEFORE_DAY_USER_INCRE = 'GTE_BEFORE_DAY_USER_INCRE';

//3.用户增长统计
export const QRY_USER_INCRE_BY_TIME = 'QRY_USER_INCRE_BY_TIME';



//1统计分析首页新增用户tab
export function usersPieData () {
	return {
		type: NEW_USER_ADD_USERS,
		payload: {
			promise: HttpUtil.ExpressApi.post('/usersPieData'),
		},
	};
}

//2昨日用户增长统计(有get是昨日，否则是qry)
export function getBeforeDayUserIncre () {
	return {
		type: GTE_BEFORE_DAY_USER_INCRE,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/tenant/getBeforeDayUserIncre', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
				},
			}),
		},
	};
}

//3.用户增长统计
export function qryUserIncreByTime (qryBean = {}) {

	return {
		type: QRY_USER_INCRE_BY_TIME,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/tenant/qryUserIncreByTime', {
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
