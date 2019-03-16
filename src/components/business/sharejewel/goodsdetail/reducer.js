'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function ShareJewelGoodsDetailReducer (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		//
		case `${actions.QRY_SHARE_JEWEL_SKU_GROUP}_SUCCESS`:{
			return state.set('skuGroup', ret);
		}
		case `${actions.DEAL_SHARE_JEWEL_GOODS}_SUCCESS`:{
			return state.set('goodsDetail', ret);
		}
		case `${actions.QRY_SHARE_JEWEL_SKU_PROP_DEF}_SUCCESS`:{
			return state.set('skuPropDef', ret);
		}
		case `${actions.QRY_SHARE_JEWEL_SKU}_SUCCESS`:{
			return state.set('skuList', ret);
		}
		case `${actions.DEAL_SHARE_JEWEL_SKU}_SUCCESS`:{
			return state.set('dealJewelSkuInfo', ret);
		}
		case `${actions.DEAL_SHARE_JEWEL_SKU_PROP_VALUE}_SUCCESS`:{
			return state.set('dealJewelSkuPropInfo', ret);
		}
		case `${actions.QRY_SHARE_JEWEL_GOODS_DETAIL}_SUCCESS`:{
			return state.set('goodsDetail', ret);
		}
		case `${actions.DEAL_SHARE_JEWEL_GOODS_NOTE}_SUCCESS`:{
			return state.set('goodsNoteUrl', ret);
		}
		case `${actions.CLEAR_SHARE_JEWEL_GOODS}`:{
			console.warn(`${actions.CLEAR_SHARE_JEWEL_GOODS}_SUCCESS`);
			return state.set('goodsDetail', null).set('skuPropDef', null);
		}
		default:
			return state;
	}
}
