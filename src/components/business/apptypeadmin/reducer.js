'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function AppTypeService (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		//查询与初始化应用类型
		case `${actions.QRY_APP_TYPE_BY_FORM}_SUCCESS`:
			return state.set('appTypeList', ret.records);
		//app初始化信息
		case `${actions.QRY_APP_TYPE_BY_ID}_SUCCESS`: {
			const appTypeList = ret.records;
			let currentAppType = {};
			if (appTypeList && appTypeList[0]) {
				currentAppType = appTypeList[0];
			}
			return state.set('currentAppType', currentAppType);
		}
		case actions.INIT_A_APP_TYPE_FOR_ADD:
			return state.set('currentAppType', {});
		//删除 app
		case `${actions.DELETE_APP_TYPE}_SUCCESS`:
			return state.delete('currentAppType');
		//app类型处理
		case `${actions.DEAL_APP_TYPE}_SUCCESS`:
		default:
			return state;
	}
}
