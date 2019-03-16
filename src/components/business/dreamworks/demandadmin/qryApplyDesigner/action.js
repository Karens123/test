'use strict';

import * as HttpUtil from 'utils/HttpUtil';

export const QRY_DSN_DETAIL = 'QRY_DSN_DETAIL';
export const AUDIT_DSN = 'AUDIT_DSN';
export const CLEAR_DSN_DETAIL ='CLEAR_DSN_DETAIL';
//1. 查询设计师详情
export function qryDsnDetail( record={} ) {
	return {
		type:	QRY_DSN_DETAIL,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/getDsnerFullInfo', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					record
				},
			}),
		},
	};
}

//2. 审核商户
export function auditDesigner({ operType,entityType,entityId,auditResult,ifSendSms }) {
	return {
		type: AUDIT_DSN,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/auditDreamworksEntity', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					auditDreamworksEntityAction: {
						entityType,entityId,auditResult,ifSendSms
					}
				},
			}),
		},
	};
}
export function clearDSNDetail() {
	return {
		type: CLEAR_DSN_DETAIL,
		payload: { dsnDetail: {} },
	};
}