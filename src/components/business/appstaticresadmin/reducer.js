'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function AppStaticResService (
	state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		//1. 根据条件查询发现列表
		case `${actions.QRY_APP_STATIC_RES_BY_FORM}_SUCCESS`: { //执行查询操作后，清空发现信息列表
			return state.set('appStaticResList', ret.records).
				delete('appStaticResItemList');
		}
		//2. 通过id获取一个发现类型数据
		case `${actions.QRY_APP_STATIC_RES_BY_ID}_SUCCESS`: {
			const appStaticResList = ret.records;
			let currentAppStaticRes = {};
			if (appStaticResList && appStaticResList[0]) {
				currentAppStaticRes = appStaticResList[0];
			}
			return state.set('currentAppStaticRes', currentAppStaticRes);
		}
		//3.  通过发现类型id获取发现信息数据列表
		case `${actions.GET_APP_STATIC_RES_ITEM_BY_RES_ID}_SUCCESS`:
			return state.set('appStaticResItemList', ret.records);
		//4. 通过发现信息id获取发现信息数据
		case `${actions.QRY_RES_ITEM_BY_ID}_SUCCESS`: {
			const appStaticResItemList = ret.records;
			let currentAppStaticResItem = {};
			if (appStaticResItemList && appStaticResItemList[0]) {
				currentAppStaticResItem = appStaticResItemList[0];
			}
			return state.set('currentAppStaticResItem',
				currentAppStaticResItem);
		}
		//5. 初始化一个发现类型用于新增
		case actions.INIT_A_APP_STATIC_RES_FOR_ADD:
			return state.set('currentAppStaticRes', ret);
		//6. 初始化一个发现信息用于新增
		case actions.INIT_A_RES_ITEM_FOR_ADD:
			return state.set('currentAppStaticResItem', ret);
		//7. 删除单条发现类型数据
		case `${actions.DEL_APP_STATIC_RES}_SUCCESS`:
			return state.delete('currentAppStaticRes');
		//8. 删除单条发现信息数据
		case `${actions.DEL_APP_STATIC_RES_ITEM}_SUCCESS`:
			return state.delete('currentAppStaticResItem');
		//9. 处理发现类型信息
		case `${actions.DEAL_APP_STATIC_RES}_SUCCESS`:
		//10. 处理发现信息
		case `${actions.DEAL_APP_STATIC_RES_ITEM}_SUCCESS`:
		default:
			return state;
	}
}
