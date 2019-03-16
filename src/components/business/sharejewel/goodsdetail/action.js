'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as CookieUtil from 'utils/CookieUtil';
import * as Constant from 'utils/Constant';

export const QRY_SHARE_JEWEL_SKU_GROUP = 'QRY_SHARE_JEWEL_SKU_GROUP';
export const DEAL_SHARE_JEWEL_GOODS ='DEAL_SHARE_JEWEL_GOODS';
export const QRY_SHARE_JEWEL_SKU_PROP_DEF='QRY_SHARE_JEWEL_SKU_PROP_DEF';
export const DEAL_SHARE_JEWEL_SKU_PROP_VALUE='DEAL_SHARE_JEWEL_SKU_PROP_VALUE';
export const DEAL_SHARE_JEWEL_SKU='DEAL_SHARE_JEWEL_SKU';
export const QRY_SHARE_JEWEL_SKU='QRY_SHARE_JEWEL_SKU';
export const QRY_SHARE_JEWEL_GOODS_DETAIL='QRY_SHARE_JEWEL_GOODS_DETAIL';
export const DEAL_SHARE_JEWEL_GOODS_NOTE = 'DEAL_SHARE_JEWEL_GOODS_NOTE';
export const CLEAR_SHARE_JEWEL_GOODS='CLEAR_SHARE_JEWEL_GOODS';
//此部分和ShareGoodsDetail.js高度耦合，不要轻易更改变量名，会引起bug
export function qryShareJewelSkuGroup () {
	return {
		type: QRY_SHARE_JEWEL_SKU_GROUP,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/goods/qrySkuGroup', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
				}
			}),
		},
	};
}
export function dealShareJewelGoods ({ record={},operType }) {
	const userId = CookieUtil.getCookie('userId');
	return {
		type: DEAL_SHARE_JEWEL_GOODS,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/goods/deal', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					userId,
					record
				},
			}),
		},
	};
}
export function qryShareJewelSkuPropDef (skuGroupId) {

	return {
		type: QRY_SHARE_JEWEL_SKU_PROP_DEF,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/goods/getSkuPropDef', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					record: {
						skuGroupId,
					}
				},
			}),
		},
	};
}
export function dealShareJewelSkuPropValue ({ skuPropId,newPropValue }) {
	const userId = CookieUtil.getCookie('userId');
	return {
		type: DEAL_SHARE_JEWEL_SKU_PROP_VALUE,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/goods/addSkuPropValue', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					userId,
					operType: 1,
					record: {
						skuPropId,
						newPropValue
					}
				},
			}),
		},
	};
};
export function dealShareJewelSku ({ record,operType }) {
	// 操作类型,1-新增 2-修改非必填 3-删除
	const userId = CookieUtil.getCookie('userId');
	return {
		type: DEAL_SHARE_JEWEL_SKU,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/goods/sku/deal', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					userId,
					operType,
					record,
				},
			}),
		},
	};
};

export function qryShareJewelSku ({ record={},pageSize=100,currentPage=1 }) {
	//分页？不存在的。
	return {
		type: QRY_SHARE_JEWEL_SKU,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/goods/pageQrySku', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					pageSize,
					currentPage,
					record
				},
			}),
		},
	};
};

export function qryShareJewelGoodsDetail (goodsId) {
	return {
		type: QRY_SHARE_JEWEL_GOODS_DETAIL,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/goods/details', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					record: {
						goodsId
					}
				},
			}),
		},
	};
};

export function dealGoodsNote (goodsNote) {
	return {
		type: DEAL_SHARE_JEWEL_GOODS_NOTE,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/goods/note/gen', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					goodsNote,
				},
			}),
		},
	};
};
export function clear() {
	return {
		type: CLEAR_SHARE_JEWEL_GOODS,
		payload: { data: null },
	};
};