'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function prodInfor (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		//查询所有产品列
		case `${actions.PROD_LIST_INIF}_SUCCESS`:
			return state.set('prodPicList', []).
				set('prodInfoList', ret.records);

		case `${actions.QRY_UP_PROD_BY_PROD_ID}_SUCCESS`: {
			const prodInfoList = ret.records;
			let currentProd = {};
			if (prodInfoList && prodInfoList[0]) {
				currentProd = prodInfoList[0];
			}
			return state.set('currentProd', currentProd);
		}
		case `${actions.PROD_MBOARD_TYPE_SELECT_LIST}_SUCCESS`:
			return state.set('mboardTypeList', ret.mboardTypeList);
		case `${actions.QRY_UP_PROD_PIC_BY_PROD_ID}_SUCCESS`:
			return state.set('prodPicList', ret.records);
		case `${actions.QRY_UP_PROD_PIC_BY_PROD_PIC_ID}_SUCCESS`: {
			let currentProdPic = {};
			if (ret.records && ret.records[0]) {
				currentProdPic = ret.records[0];
			}
			return state.set('currentProdPic', currentProdPic);
		}
		case actions.INIT_A_UP_PROD_FOR_ADD:
			return state.set('currentProd', ret).delete('rspInfo');
		case actions.INIT_A_UP_PROD_IMG_FOR_ADD:
			return state.set('currentProdPic', ret).delete('rspInfo');
		case `${actions.DELETE_UP_PROD}_SUCCESS`:
			return state.delete('currentProd');
		case `${actions.DELETE_UP_PROD_PIC}_SUCCESS`:
			return state.delete('currentProdPic');
		case `${actions.DEAL_UP_PROD}_SUCCESS`:
		case `${actions.DEAL_UP_PROD_PIC}_SUCCESS`:
		default:
			return state;
	}
}
