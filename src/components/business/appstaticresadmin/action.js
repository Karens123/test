'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

//1. 通过条件表单查询res列表
export const QRY_APP_STATIC_RES_BY_FORM = 'QRY_APP_STATIC_RES_BY_FORM';
//2. 通过resId查询单个res数据
export const QRY_APP_STATIC_RES_BY_ID = 'QRY_APP_STATIC_RES_BY_ID';
//3.根据resId获取resItem列表
export const GET_APP_STATIC_RES_ITEM_BY_RES_ID = 'GET_APP_STATIC_RES_ITEM_BY_RES_ID';
//4.根据itemId获取resItem列表
export const QRY_RES_ITEM_BY_ID = 'QRY_RES_ITEM_BY_ID';
//5. 删除res
export const DEL_APP_STATIC_RES = 'DEL_APP_STATIC_RES';
//6. 删除resItem
export const DEL_APP_STATIC_RES_ITEM = 'DEL_APP_STATIC_RES_ITEM';
//7. 初始化一个res用于新增
export const INIT_A_APP_STATIC_RES_FOR_ADD = 'INIT_A_APP_STATIC_RES_FOR_ADD';
//8. 初始化一个resItem用于新增
export const INIT_A_RES_ITEM_FOR_ADD = 'INIT_A_RES_ITEM_FOR_ADD';
//9. res处理
export const DEAL_APP_STATIC_RES = 'DEAL_APP_STATIC_RES';
//10. resItem处理
export const DEAL_APP_STATIC_RES_ITEM = 'DEAL_APP_STATIC_RES_ITEM';

//1. 查询发现类型
export function qryAppStaticResByForm (qryBean = {}) {
	return {
		type: QRY_APP_STATIC_RES_BY_FORM,
		payload: {
			promise: HttpUtil.WenwenApi.post(
				'/admin/data/appStaticResource/qry', {
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						qryBean,
					},
				}),
		},
	};
}

//2. 根据Id查询发现类型数据
export function qryAppStaticResById (id) {
	const qryBean = { id };
	return {
		type: QRY_APP_STATIC_RES_BY_ID,
		payload: {
			promise: HttpUtil.WenwenApi.post(
				'/admin/data/appStaticResource/qry', {
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						qryBean,
					},
				}),
		},
	};
}

//3. 通过resId获取明细数据列表
export function getResItemByResId (appResourceId) {
	const qryBean = { appResourceId };
	return {
		type: GET_APP_STATIC_RES_ITEM_BY_RES_ID,
		payload: {
			promise: HttpUtil.WenwenApi.post(
				'/admin/data/appStaticResource/item/qry', {
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						qryBean,
					},
				}),
		},
	};
}

//4. 通过发现信息id获取发现信息数据
export function qryAppStaticResItemById (id) {
	const qryBean = { id };
	return {
		type: QRY_RES_ITEM_BY_ID,
		payload: {
			promise: HttpUtil.WenwenApi.post(
				'/admin/data/appStaticResource/item/qry', {
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						qryBean,
					},
				}),
		},
	};
}

//5. 删除单条发现类型数据
export function deleteAppStaticRes (currentAppStaticRes = {}) {
	return {
		type: DEL_APP_STATIC_RES,
		payload: {
			promise: HttpUtil.WenwenApi.post(
				'/admin/data/appStaticResource/deal', {
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						operType: Constant.OPER_TYPE_DELETE,
						dealList: [currentAppStaticRes],
					},
				}),
		},
	};
}

//6. 删除单条发现信息数据
export function deleteAppStaticResItem (currentAppStaticResItem = {}) {
	return {
		type: DEL_APP_STATIC_RES_ITEM,
		payload: {
			promise: HttpUtil.WenwenApi.post(
				'/admin/data/appStaticResource/item/deal', {
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						operType: Constant.OPER_TYPE_DELETE,
						dealList: [currentAppStaticResItem],
					},
				}),
		},
	};
}

//7. 初始化一个发现类型用于新增
export function initAAppStaticResForAdd () {
	return {
		type: INIT_A_APP_STATIC_RES_FOR_ADD,
		payload: {},
	};
}

//8. 初始化一个发现信息用于新增
export function initAResItemForAdd (appResourceId) {
	return {
		type: INIT_A_RES_ITEM_FOR_ADD,
		payload: { appResourceId },
	};
}

//9. 处理发现类型，新增或者修改
export function dealAppStaticRes (operType, appStaticRes) {
	return {
		type: DEAL_APP_STATIC_RES,
		payload: {
			promise: HttpUtil.WenwenApi.post(
				'/admin/data/appStaticResource/deal', {
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						operType,
						dealList: [appStaticRes],
					},
				}),
		},
	};
}

//10. 处理发现信息，新增或者修改
export function dealAppStaticResItem (operType, discovery) {
	return {
		type: DEAL_APP_STATIC_RES_ITEM,
		payload: {
			promise: HttpUtil.WenwenApi.post(
				'/admin/data/appStaticResource/item/deal', {
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						operType,
						dealList: [discovery],
					},
				}),
		},
	};
}
