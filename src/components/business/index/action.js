'use strict';

import * as HttpUtil from 'utils/HttpUtil';

//1. 珠宝初始化
export const JEWEL_ALL_LIST_INIT_INFO = 'JEWEL_ALL_LIST_INIT_INFO';

//1. jewel  list初始化
export function getAllJewelList (jewelIOArguments) {
	return {
		type: JEWEL_ALL_LIST_INIT_INFO,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/qryUpJewel', {
				data: {
					'pubInfo': HttpUtil.getPubInfo(),
					'jewelInfo': {
						'jewelName': jewelIOArguments.jewelName,
						'jewelType': jewelIOArguments.jewelType
					},
					'reserv1': '',
					'reserv2': ''
				}
			})
		}
	};
}

//3. 初始化修改珠宝
export function initCurrentJewel (CurrentJewel = {}) {
	return {
		type: INIT_CURRENT_JEWEL_INFOR,
		payload: CurrentJewel
	};
}

//4. 修改/新增珠宝
export function editJewel (newPordData = {}, operType) {
	return {
		type: EDIT_JEWEL_INFOR,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/dealUpJewel', {
				data: {
					'pubInfo': HttpUtil.getPubInfo(),
					'operType': operType,
					'jewelInfo': newPordData,
					'reserv1': '',
					'reserv2': ''
				}
			})
		}
	};
}

//5. 删除珠宝
export function delJewelData (operType, currentObj = {}) {

	return {
		type: DEL_JEWEL_INFOR,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/dealUpJewel', {
				data: {
					'pubInfo': HttpUtil.getPubInfo(),
					'operType': operType,
					'jewelInfo': { 'jewelId': currentObj.jewelId },
					'reserv1': '',
					'reserv2': ''
				}
			})
		}
	};
}

//6 珠宝图片查询
export function getAllJewelImgList (currentJewel = {}) {
	return {
		type: JEWEL_ALL_IMG_INFOR,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/qryUpJewelPic', {
				data: {
					'pubInfo': HttpUtil.getPubInfo(),
					'jewelId': currentJewel.jewelId,
					'reserv1': '',
					'reserv2': ''
				}
			})
		}
	};
}

//7. 初始化珠宝图片
export function initJewelImg (SeletCurrentPic = {}) {
	return {
		type: INIT_JEWEL_PHTO_INFOR,
		payload: SeletCurrentPic
	};
}

//8. 修改当前珠定初始化后的图片
export function editJewelImg (operType, afterJewel = {}, filePath) {
	return {
		type: EDIT_JEWEL_PHTO_INFOR,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/dealUpJewelPic', {
				data: {
					'pubInfo': HttpUtil.getPubInfo(),
					'operType': operType,
					'jewelPic': {
						'jewelPicId': afterJewel.jewelPicId,
						'jewelId': afterJewel.jewelId,
						'jewelImage': filePath,
						'sortId': afterJewel.sortId,
						'remark': afterJewel.remark
					},
					'reserv1': '',
					'reserv2': ''
				}
			})
		}
	};
}

//9. 删除珠宝图
export function delCurrentJewlImg (operType, currentImgObj = {}) {
	return {
		type: DEL_JEWEL_PHTO_INFOR,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/dealUpJewelPic', {
				data: {
					'pubInfo': HttpUtil.getPubInfo(),
					'operType': operType,
					'jewelPic': { 'jewelPicId': currentImgObj.jewelPicId },
					'reserv1': '',
					'reserv2': ''
				}
			})
		}
	};
}

// 10. add珠宝图传递旧数据
export function addJewelimg (currentJewel = {}) {
	return {
		type: ADD_JEWEL_PHTO_INFOR,
		payload: currentJewel
	};
}
