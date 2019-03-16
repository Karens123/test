'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

export const QRY_BSN_APPLICATION = 'QRY_BSN_APPLICATION';
export const QRY_DSN_APPLICATION = 'QRY_DSN_APPLICATION';
export const QRY_BSN_DETAIL = 'QRY_BSN_DETAIL';
export const QRY_DSN_DETAIL = 'QRY_DSN_DETAIL';
export const AUDIT_BSN = 'AUDIT_BSN';
export const AUDIT_DSN = 'AUDIT_BSN';
export const CLEAR_BSN_DETAIL ='CLEAR_BSN_DETAIL';
export const CLEAR_DSN_DETAIL ='CLEAR_DSN_DETAIL';

//1. 查询发现类型
export function qryAllBusinessesForm () {
	return {
		type: QRY_ALLBUSINESSES_FORM,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/pageQryMEnterpriseApply', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					currentPage: 1,
					pageSize: 10
				},
			}),
		},
	};
}

//2. 查询设计师申请列表
export function qryDsnApplication({ currentPage=1,pageSize=10,record={} }) {
	console.log('qryDsnApplication',currentPage,record);
	return {
		type:	QRY_DSN_APPLICATION,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/pageQryMDsnerApply', {
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
//3. 查询商户申请列表
export function qryBsnApplication({ currentPage=1,pageSize=10,record={} }) {
	return {
		type:	QRY_BSN_APPLICATION,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/pageQryMEnterpriseApply', {
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
//4. 查询商户商户详情
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
//5. 查询设计师详情
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
