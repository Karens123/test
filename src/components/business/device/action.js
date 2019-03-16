'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

export const PAGE_QRY_DEVICE_BY_FORM = 'PAGE_QRY_DEVICE_BY_FORM';
export const GEN_DEVICE_SN = 'GEN_DEVICE_SN';
export const IMPORT_DEVICE_SN_BY_EXCEL = 'IMPORT_DEVICE_SN_BY_EXCEL';
export const QRY_PROD_FOR_SELECT = 'QRY_PROD_FOR_SELECT';
export const QRY_TENANT_FOR_SELECT = 'QRY_TENANT_FOR_SELECT';
export const DEL_DEVICE = 'DEL_DEVICE';
export const COMPLATE_REFRESH = 'COMPLATE_REFRESH';

export function pageQryDeviceByForm (
	qryBean = {}, currentPage = 1, pageSize = 10) {
	return {
		type: PAGE_QRY_DEVICE_BY_FORM,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/device/qryDeviceInfo', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					qryBean,
					currentPage,
					pageSize,
				},
			}),
		},
	};
}
export function genDeviceSn (genSnParams = {}) {
	const data = Object.assign({}, { pubInfo: HttpUtil.getPubInfo() },
		genSnParams);
	return {
		type: GEN_DEVICE_SN,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/device/genDeviceSn', {
				data,
			}),
		},
	};
}

export function importDeviceByExcel (importParams = {}) {
	const data = Object.assign({}, { pubInfo: HttpUtil.getPubInfo() },
		importParams);
	return {
		type: IMPORT_DEVICE_SN_BY_EXCEL,
		payload: {
			promise: HttpUtil.WenwenApi.post(
				'/admin/device/importDeviceSnByExcel', {
					data,
				}),
		},
	};
}

export function completeRefresh () {
	return {
		type: COMPLATE_REFRESH,
		payload: {},
	};
}

export function qryProdForSelect () {
	return {
		type: QRY_PROD_FOR_SELECT,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/qryUpProd', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					prodInfo: {},
				},
			}),
		},
	};
}

export function qryTenantForSelect () {
	return {
		type: QRY_TENANT_FOR_SELECT,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/tenant/qryForNoPlatformTenantSelect', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					record: {},
				},
			}),
		},
	};
}

export function delDevice (records = []) {
	return {
		type: DEL_DEVICE,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/device/dealDeviceInfo', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType: Constant.OPER_TYPE_DELETE,
					records,
				},
			}),
		},
	};
}
