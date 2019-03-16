'use strict';

import * as HttpUtil from 'utils/HttpUtil';

//1.通过查询表单条件查询错误日志列表
export const QRY_ERROR_LOG_BY_FORM = 'QRY_ERROR_LOG_BY_FORM';
//2.通过创建日期和日志id获取日志信息
export const GET_ERROR_LOG_BY_ID = 'GET_ERROR_LOG_BY_ID';
//3. 错误信息处理
export const DEAL_ERROR_LOG = 'DEAL_ERROR_LOG';

//1. 错误消息
export function qryErrorLogByForm (qryForm = {}) {
	const { qryBean, beginTime, endTime } = qryForm;
	return {
		type: QRY_ERROR_LOG_BY_FORM,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/sys/qryErrLogByTime', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					qryBean,
					beginTime,
					endTime,
				},
			}),
		},
	};
}
//2.根据记录id查询
export function getErrorLogById (recId = '') {
	return {
		type: GET_ERROR_LOG_BY_ID,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/sys/qryErrLog', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					qryBean: { recId },
				},
			}),
		},
	};
}

//3. 错误信息处理
export function dealErrorLog (operType, errorLogList = []) {
	return {
		type: DEAL_ERROR_LOG,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/sys/dealErrLog', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					errorLogList,
				},
			}),
		},
	};
}
