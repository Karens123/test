'use strict';

import * as HttpUtil from 'utils/HttpUtil';

//1. 模糊查询静态数据列表
export const QRY_STATIC_DATA_BY_FORM = 'QRY_STATIC_DATA_BY_FORM';
export function qryStaticDataLike (qryBean = {}) {
	return {
		type: QRY_STATIC_DATA_BY_FORM,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/base/qryStaticDataLike', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					qryBean,
				},
			}),
		},
	};
}

//2. 精确查询某个静态数据对象
export const QRY_STATIC_DATA_BY_ID = 'QRY_STATIC_DATA_BY_ID';
export function qryStaticDataById (codeType = '') {
	return {
		type: QRY_STATIC_DATA_BY_ID,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/base/qryStaticData', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					qryBean: { codeType },
				},
			}),
		},
	};
}

//3. 处理静态数据
export const DEAL_STATIC_DATA = 'DEAL_STATIC_DATA';
export function dealStaticData (operType, staticData = {}) {
	return {
		type: DEAL_STATIC_DATA,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/base/dealStaticData', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					staticDataList: [staticData],
				},
			}),
		},
	};
}

//4.批量删除静态数据
export const DELETE_STATIC_DATA = 'DELETE_STATIC_DATA';
export function deleteStaticData (operType, staticDataList = []) {
	return {
		type: DELETE_STATIC_DATA,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/base/dealStaticData', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					staticDataList,
				},
			}),
		},
	};
}

//5. init_edit_staticdata(修改静态数据前初始化信息)
export const INIT_A_STATIC_DATA_FOR_ADD = 'INIT_A_STATIC_DATA_FOR_ADD';
export function initAStaticDataForAdd () {
	return {
		type: INIT_A_STATIC_DATA_FOR_ADD,
		payload: {},
	};
}
