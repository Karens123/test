'use strict';

import * as HttpUtil from 'utils/HttpUtil';

export const PUSH_NOTIFICATION = 'PUSH_NOTIFICATION';
export const PUSH_MESSAGE = 'PUSH_MESSAGE';

//2.通知记录
export const QRY_PUSH_INFO_BY_FORM = 'QRY_PUSH_INFO_BY_FORM';
export const QRY_PUSH_INFO_BY_ID = 'QRY_PUSH_INFO_BY_ID';

//3.信息,通知处理
export const DEAL_PUSH_INFORMATION = 'DEAL_PUSH_INFORMATION';

//4.通知记录统计初始化
export const QRY_PUSH_STATINFOR = 'QRY_PUSH_STATINFOR';

//5.推送重发
export const PUSH_NOTIFICATION_MESSAGE = 'PUSH_NOTIFICATION_MESSAGE';

//1.推送通知
export function pushNotification (data = {}) {
	data.pubInfo = HttpUtil.getPubInfo();
	return {
		type: PUSH_NOTIFICATION,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/sys/push', { data }),
		},
	};
}
//1.推送消息
export function pushMessage (data = {}) {
	data.pubInfo = HttpUtil.getPubInfo();
	return {
		type: PUSH_MESSAGE,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/sys/push', { data }),
		},
	};
}

//2.初始化/查询通知记录
export function qryPushInfoByForm (qryBean) {
	return {
		type: QRY_PUSH_INFO_BY_FORM,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/sys/qryPushInfoBt', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					beginTime: qryBean.beginTime,
					endTime: qryBean.endTime,
					qryBean,
				},
			}),
		},
	};
}
export function qryPushInfoById (responseId) {
	return {
		type: QRY_PUSH_INFO_BY_ID,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/sys/qryPushInfo', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					qryBean: { responseId },
				},
			}),
		},
	};
}

//3.信息,通知处理
export function dealPushInfo (operType, currentRecord) {
	return {
		type: DEAL_PUSH_INFORMATION,
		payload: {
			promise: HttpUtil.WenwenApi.post('/api/user/dealPushInfo', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					pushInfoList: [
						{
							recId: currentRecord.recId,
						}],

				},
			}),
		},
	};
}

//4.通知记录统计初始化
export function qryPushStatInfor (responseId) {
	return {
		type: QRY_PUSH_STATINFOR,
		payload: {
			promise: HttpUtil.WenwenApi.post(
				'/admin/sys/qryPushStatInfoByResponseId', {
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						responseId,
					},
				}),
		},
	};
}

//5.推送重发
export function rePushMessage (data = {}) {
	data.pubInfo = HttpUtil.getPubInfo();
	return {
		type: PUSH_NOTIFICATION_MESSAGE,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/sys/rePush', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					responseId: data.responseId,
					deviceType: data.deviceType,
					target: data.target,
					targetValue: data.targetValue,
				},
			}),
		},
	};
}
