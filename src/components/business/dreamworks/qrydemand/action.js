'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

export const QRY_DEMAND_DETAIL = 'QRY_DEMAND_DETAIL';
export const AUDIT_DEMAND='AUDIT_DEMAND';
export const CLEAR_DEMAND_DETAIL ='CLEAR_DEMAND_DETAIL';

export function qryDemandDetail (demandId) {
	return {
		type: QRY_DEMAND_DETAIL,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/demand', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					record: {
						demandId
					}
				},
			}),
		},
	};
}


export function auditDemand({ operType,ifSendSms, auditResult, entityId }) {

	return {
		type: AUDIT_DEMAND,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/auditDreamworksEntity', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					auditDreamworksEntityAction: {
						ifSendSms,
						auditResult,
						entityId,
						entityType: 3,
					}
				},
			}),
		},
	};
}

export function clearDemand() {
	return {
		type: CLEAR_DEMAND_DETAIL,
		payload: { demand: {} },
	};
}