'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

//1. AppKindConfig(查询与初如时的有应用类型列表)
export const QRY_APP_TYPE_BY_FORM = 'QRY_APP_TYPE_BY_FORM';
//2. AppKindConfig(查询与初如时的有应用类型列表)
export const QRY_APP_TYPE_BY_ID = 'QRY_APP_TYPE_BY_ID';
//3. 初始化APP类型
export const INIT_A_APP_TYPE_FOR_ADD = 'INIT_A_APP_TYPE_FOR_ADD';
//4. 处理APP类型
export const DEAL_APP_TYPE = 'DEAL_APP_TYPE';
//5.删除app类型
export const DELETE_APP_TYPE = 'DELETE_APP_TYPE';

//1. 应用类型查询 (REST)
export function qryAppTypeByForm (appTypeInfo = {}) {
	return {
		type: QRY_APP_TYPE_BY_FORM,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/base/qryBsAppType', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					appTypeInfo,
				},
			}),
		},
	};
}
//2. 应用类型查询 (REST)
export function qryAppTypeById (appType = '') {
	return {
		type: QRY_APP_TYPE_BY_ID,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/base/qryBsAppType', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					appTypeInfo: { appType },
				},
			}),
		},
	};
}

//2. 修改apptype初始化
export function initAAppTypeForAdd (app = {}) {
	return {
		type: INIT_A_APP_TYPE_FOR_ADD,
		payload: app,
	};
}

//3. 修改/新增apptype操作
export function dealAppType (operType, appTypeInfo = {}) {
	return {
		type: DEAL_APP_TYPE,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/base/dealBsAppType', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					appTypeList: [appTypeInfo],
				},
			}),
		},
	};
}

//4.删附APP DEL APP
export function deleteAppType (appTypeList = []) {
	return {
		type: DELETE_APP_TYPE,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/base/dealBsAppType', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType: Constant.OPER_TYPE_DELETE,
					appTypeList,
				},
			}),
		},
	};
}
