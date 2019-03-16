'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

//1. 产品列表
export const PROD_LIST_INIF = 'QRY_UP_PROD_BY_FORM';
//2、通过prodId查询产品信息
export const QRY_UP_PROD_BY_PROD_ID = 'QRY_UP_PROD_BY_PROD_ID';
//3. 根据PROD_ID查询图片列表
export const QRY_UP_PROD_PIC_BY_PROD_ID = 'QRY_UP_PROD_PIC_BY_PROD_ID';
//4. 根据prodImgId查询图片
export const QRY_UP_PROD_PIC_BY_PROD_PIC_ID = 'QRY_UP_PROD_PIC_BY_PROD_PIC_ID';
//5.初始化一个新增的图片
export const INIT_A_UP_PROD_IMG_FOR_ADD = 'INIT_A_UP_PROD_IMG_FOR_ADD';
//6.初始化一个新增的产品
export const INIT_A_UP_PROD_FOR_ADD = 'INIT_A_UP_PROD_FOR_ADD';
//7.批量删除产品信息
export const DELETE_UP_PROD = 'DELETE_UP_PROD';
//8.批量删除产品图片信息
export const DELETE_UP_PROD_PIC = 'DELETE_UP_PROD_PIC';
//9.批量处理产品
export const DEAL_UP_PROD = 'DEAL_UP_PROD';
//10.批量处理产品图片
export const DEAL_UP_PROD_PIC = 'DEAL_UP_PROD_PIC';
//11.select 产品型号主板型号列表
export const PROD_MBOARD_TYPE_SELECT_LIST = 'PROD_MBOARD_TYPE_SELECT_LIST';

//1. 通过条件表单产品列表
export function qryUpProd (prodInfo = {}) {
	return {
		type: PROD_LIST_INIF,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/qryUpProd', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					prodInfo,
				},
			}),
		},
	};
}

//2、通过prodId查询产品信息
export function qryUpProdByProdId (prodId) {
	return {
		type: QRY_UP_PROD_BY_PROD_ID,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/qryUpProd', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					prodInfo: { prodId },
				},
			}),
		},
	};
}

//3. 根据PROD_ID查询图片列表
export function qryUpProdImgByProdId (prodId) {
	return {
		type: QRY_UP_PROD_PIC_BY_PROD_ID,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/qryUpProdPic', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					qryUpProdPic: { prodId },
				},
			}),
		},
	};
}

//4. 根据prodPicId查询图片
export function qryUpProdPicByProdPicId (prodPicId) {
	return {
		type: QRY_UP_PROD_PIC_BY_PROD_PIC_ID,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/qryUpProdPic', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					qryUpProdPic: { prodPicId },
				},
			}),
		},
	};
}

//5.初始化一个新增的图片
export function initAUpProdPicForAdd (prodId) {
	return {
		type: INIT_A_UP_PROD_IMG_FOR_ADD,
		payload: {
			prodId,
		},
	};
}

//6.初始化一个新增的产品
export function initAUpProdForAdd () {
	return {
		type: INIT_A_UP_PROD_FOR_ADD,
		payload: {},
	};
}

//7.批量处理产品信息
export function dealUpProd (operType, upProdList = []) {
	return {
		type: DEAL_UP_PROD,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/dealUpProd', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					upProdList,
				},
			}),
		},
	};
}

//8.批量处理图片信息
export function dealUpProdPic (operType, upProdPicList = []) {
	return {
		type: DEAL_UP_PROD_PIC,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/dealUpProdPic', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					upProdPicList,
				},
			}),
		},
	};
}

//9.批量删除产品信息
export function deleteUpProd (upProdList = []) {
	return {
		type: DELETE_UP_PROD,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/dealUpProd', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType: Constant.OPER_TYPE_DELETE,
					upProdList,
				},
			}),
		},
	};
}

//10.批量处理图片信息
export function deleteUpProdPic (upProdPicList = []) {
	return {
		type: DELETE_UP_PROD_PIC,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/dealUpProdPic', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType: Constant.OPER_TYPE_DELETE,
					upProdPicList,
				},
			}),
		},
	};
}

//11.获取主板类型列表
export function getAllProdMboradTypeSelectList () {
	return {
		type: PROD_MBOARD_TYPE_SELECT_LIST,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/getUpProdMboardType',
				{
					data: {
						pubInfo: HttpUtil.getPubInfo(),
					},
				}),
		},
	};
}
