'use strict';

import * as HttpUtil from 'utils/HttpUtil';

export const QRY_BSN_DETAIL = 'QRY_BSN_DETAIL';
export const AUDIT_BSN = 'AUDIT_BSN';
export const CLEAR_BSN_DETAIL ='CLEAR_BSN_DETAIL';

//1. 查询商户详情
export function qryBsnDetail( record={} ) {
	return {
		type:	QRY_BSN_DETAIL,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/getEntFullInfo', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					record
				},
			}),
		},
	};
}
//2. 审核商户
export function auditBusiness({ operType,entityType,entityId,auditResult,ifSendSms }) {
	return {
		type:	AUDIT_BSN,
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


export function clearBSNDetail() {
	return {
		type: CLEAR_BSN_DETAIL,
		payload: { bsnDetail: {} },
	};
}
