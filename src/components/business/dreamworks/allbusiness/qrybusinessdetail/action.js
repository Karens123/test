'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

export const QRY_BUSINESS_DETAIL = 'QRY_BUSINESS_DETAIL';
export const QRY_DEMAND_LIST = 'QRY_DEMAND_LIST';

export function qryBusinessDetail (record={}) {
	return {
		type: QRY_BUSINESS_DETAIL,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/getEntAggregation', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					record
				},
			}),
		},
	};
}
export function qryDemandList ({ currentPage=1,pageSize=10,record={} }) {
	return {
		type: QRY_DEMAND_LIST,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/demand/enterprise', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					currentPage,
					pageSize,
					record
				},
			}),
		},
	};
}
export function qryDemandInAuditing ({ currentPage=1,pageSize=10,record={} }) {
	return {
		type: QRY_DEMAND_LIST,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/demand/enterprise/inAuditing', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					currentPage,
					pageSize,
					record,
				},
			}),
		},
	};
}