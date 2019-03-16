'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

//1. 查询租户
export const QRY_TENANT_BY_FORM = 'QRY_TENANT_BY_FORM';

//1. 查询租户
export function qryTenantByForm (qryTenantForm = {}) {
	return {
		type: QRY_TENANT_BY_FORM,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/tenant/qry', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					record: qryTenantForm
				},
			}),
		},
	};
}


//2. 查询租户
export const DEAL_TENANT = 'DEAL_TENANT';

//2. deal tenant
export function dealTenant ( operType,TenantForm = {} ) {
	return {
		type: DEAL_TENANT,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/tenant/deal', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					records: [TenantForm],
				},
			}),
		},
	};
}


//3. 初始化租户
export const INIT_EDIT_TENANT = 'INIT_EDIT_TENANT';


export function initEditTenant ( currentSelectTenant = {}, currentPage ) {
	return {
		type: INIT_EDIT_TENANT,
		payload: { currentSelectTenant, currentPage },
	};
}


