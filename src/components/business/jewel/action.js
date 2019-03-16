'use strict';

import * as HttpUtil from 'utils/HttpUtil';

//1. 珠宝初始化
export const JEWEL_ALL_LIST_INIT_INFO = 'JEWEL_ALL_LIST_INIT_INFO';
//2. 珠宝查询
export const JEWEL_CHECK_CURRENT_INFO = 'JEWEL_CHECK_CURRENT_INFO';
//3. 初始化修改珠宝
export const INIT_CURRENT_JEWEL_INFOR = 'INIT_CURRENT_JEWEL_INFOR';
//4. 修改/新增珠宝
export const EDIT_JEWEL_INFOR = 'EDIT_JEWEL_INFOR';
//5. 删除珠宝
export const DEL_JEWEL_INFOR = 'DEL_JEWEL_INFOR';
//6. 珠宝图片查询
export const JEWEL_ALL_IMG_INFOR = 'JEWEL_ALL_IMG_INFOR';
//7. 初始化珠宝图片
export const INIT_JEWEL_PHTO_INFOR = 'INIT_JEWEL_PHTO_INFOR';
//8. 编辑化珠宝图片
export const EDIT_JEWEL_PHTO_INFOR = 'EDIT_JEWEL_PHTO_INFOR';
//9. 删除珠宝图片
export const DEL_JEWEL_PHTO_INFOR = 'DEL_JEWEL_PHTO_INFOR';
//10.珠宝图传递旧数据
export const ADD_JEWEL_PHTO_INFOR = 'ADD_JEWEL_PHTO_INFOR';
//11.新增珠宝图
export const NEW_ADD_ONE_JEWEL_PHTO = 'NEW_ADD_ONE_JEWEL_PHTO';
//12. 珠宝型号有序列表(单独select接口)
export const JEWEL_SELECT_LIST = 'JEWEL_SELECT_LIST';

//1. jewel  list初始化
export function getAllJewelList (jewelInfo={}) {
	console.log('jewelInfo________fff__________', jewelInfo);
	return {
		type: JEWEL_ALL_LIST_INIT_INFO,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/qryUpJewel', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					jewelInfo,
				},
			}),
		},
	};
}

//3. 初始化修改珠宝
export function initCurrentJewel (CurrentJewel = {}) {
	console.log('CurrentJewel', CurrentJewel);
	return {
		type: INIT_CURRENT_JEWEL_INFOR,
		payload: CurrentJewel,
	};
}

//4. 修改/新增珠宝
export function editJewel (newPordData = {}, operType) {
	return {
		type: EDIT_JEWEL_INFOR,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/dealUpJewel', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					jewelInfo: newPordData,
				},
			}),
		},
	};
}

//5. 删除珠宝
export function delJewelData (operType, currentObj = {}) {

	return {
		type: DEL_JEWEL_INFOR,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/dealUpJewel', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					jewelInfo: { jewelId: currentObj.jewelId },
				},
			}),
		},
	};
}

//6 珠宝图片查询
export function getAllJewelImgList (currentJewel = {}) {
	return {
		type: JEWEL_ALL_IMG_INFOR,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/qryUpJewelPic', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					jewelId: currentJewel.jewelId,
				},
			}),
		},
	};
}

//7. 初始化珠宝图片
export function initJewelImg (SeletCurrentPic = {}) {
	return {
		type: INIT_JEWEL_PHTO_INFOR,
		payload: SeletCurrentPic,
	};
}

//8. 修改当前珠定初始化后的图片
export function editJewelImg (operType, afterJewel = {}, filePath) {
	return {
		type: EDIT_JEWEL_PHTO_INFOR,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/dealUpJewelPic', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					jewelPic: {
						jewelPicId: afterJewel.jewelPicId,
						jewelId: afterJewel.jewelId,
						jewelImage: filePath,
						sortId: afterJewel.sortId,
						remark: afterJewel.remark,
					},
				},
			}),
		},
	};
}

//9. 删除珠宝图
export function delCurrentJewlImg (operType, currentImgObj = {}) {
	return {
		type: DEL_JEWEL_PHTO_INFOR,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/dealUpJewelPic', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					jewelPic: { jewelPicId: currentImgObj.jewelPicId },
				},
			}),
		},
	};
}

// 10. add珠宝图传递旧数据
export function addJewelimg (currentJewel = {}) {
	return {
		type: ADD_JEWEL_PHTO_INFOR,
		payload: currentJewel,
	};
}