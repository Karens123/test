'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

//1. 通过条件表单查询activity列表
export const QRY_ACTIVITY_BY_FORM = 'QRY_ACTIVITY_BY_FORM';
//2. 通过activityId查询单个activity数据
export const QRY_PRAYER_ACTIVITY_BY_ID = 'QRY_PRAYER_ACTIVITY_BY_ID';
//3.根据activityId获取activityDetail表
export const GET_PRAYER_ACTIVITY_DETAIL_BY_ACTIVITY_ID = 'GET_PRAYER_ACTIVITY_DETAIL_BY_ACTIVITY_ID';
//4.根据 activityId+locale 获取 activityDetail 列表
export const QRY_ACTIVITY_DETAIL_BY_ID = 'QRY_ACTIVITY_DETAIL_BY_ID';
//5. 删除 activity
export const DEL_PRAYER_ACTIVITY = 'DEL_PRAYER_ACTIVITY';
//6. 删除 activityDetail
export const DEL_PRAYER_ACTIVITY_DETAIL = 'DEL_PRAYER_ACTIVITY_DETAIL';
//7. 初始化一个activity用于新增
export const INIT_A_ACTIVITY_FOR_ADD = 'INIT_A_ACTIVITY_FOR_ADD';
//8. 初始化一个activityDetail用于新增
export const INIT_A_ACTIVITY_DETAIL_FOR_ADD = 'INIT_A_ACTIVITY_DETAIL_FOR_ADD';
//9. activity处理
export const DEAL_ACTIVITY = 'DEAL_ACTIVITY';
//10. activityDetail处理
export const DEAL_ACTIVITY_DETAIL = 'DEAL_ACTIVITY_DETAIL';
//11. 发放大奉诵奖励
export const SEND_ACTIVITY_REWARD = 'SEND_ACTIVITY_REWARD';

//1. 查询活动数据
export function qryPrayerActivityByForm (record = {}, stateList = [], currentPage, pageSize) {
	return {
		type: QRY_ACTIVITY_BY_FORM,
		payload: {
			promise: HttpUtil.WenwenApi.post(
				'/admin/prayer/activity/list', {
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						record,
						stateList,
						currentPage,
						pageSize,
					},
				}),
		},
	};
}

//2. 根据Id查询发现类型数据
export function qryActivityById (activityId) {
	return {
		type: QRY_PRAYER_ACTIVITY_BY_ID,
		payload: {
			promise: HttpUtil.WenwenApi.post(
				'/admin/prayer/activity/get', {
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						record: activityId,
					},
				}),
		},
	};
}

//3. 通过activityId获取明细数据列表
export function getActivityDetailByActivityId (activityId) {
	const record = { activityId,  };
	return {
		type: GET_PRAYER_ACTIVITY_DETAIL_BY_ACTIVITY_ID,
		payload: {
			promise: HttpUtil.WenwenApi.post(
				'/admin/prayer/activity/detail/list', {
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						currentPage: 1,
						pageSize: 10,
						record,
					},
				}),
		},
	};
}

//4. 通过id获取发现信息数据
export function qryActivityDetailById (activityId, locale) {
	const record = { activityId, locale };
	return {
		type: QRY_ACTIVITY_DETAIL_BY_ID,
		payload: {
			promise: HttpUtil.WenwenApi.post(
				'/admin/prayer/activity/detail/get', {
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						record,
					},
				}),
		},
	};
}

//7. 初始化一个发现类型用于新增
export function initAActivityForAdd () {
	return {
		type: INIT_A_ACTIVITY_FOR_ADD,
		payload: {},
	};
}

//8. 初始化一个发现信息用于新增
export function initAActivityDetailForAdd (activityId) {
	return {
		type: INIT_A_ACTIVITY_DETAIL_FOR_ADD,
		payload: { activityId },
	};
}

//9. 处理发现类型，新增或者修改
export function dealPrayerActivity (operType, activity) {
	return {
		type: DEAL_ACTIVITY,
		payload: {
			promise: HttpUtil.WenwenApi.post(
				'/admin/prayer/activity/deal', {
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						operType,
						record: activity,
					},
				}),
		},
	};
}

//10. 处理发现信息，新增或者修改
export function dealPrayerActivityDetail (operType, activityDetail) {
	return {
		type: DEAL_ACTIVITY_DETAIL,
		payload: {
			promise: HttpUtil.WenwenApi.post(
				'/admin/prayer/activity/detail/deal', {
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						operType,
						record: activityDetail,
					},
				}),
		},
	};
}

//11. 发放大奉诵奖励,入参是大奉诵id
export function sendRewardForActivity (activityId) {
	return {
		type: SEND_ACTIVITY_REWARD,
		payload: {
			promise: HttpUtil.WenwenApi.post(
				'/admin/prayer/activity/detail/reward', {
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						record: activityId,
					},
				}),
		},
	};
}