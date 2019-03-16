'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function StaticDataaAdminService (
	state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		//静态数据查询成功
		case `${actions.QRY_STATIC_DATA_BY_FORM}_SUCCESS`:
			return state.set('staticDataList', ret.records);

		case `${actions.QRY_STATIC_DATA_BY_ID}_SUCCESS`: {
			const staticDataList = ret.records;
			let currentStaticData = {};
			if (staticDataList && staticDataList[0]) {
				currentStaticData = staticDataList[0];
			}
			return state.set('currentStaticData', currentStaticData);
		}
		//静态数据设置成功
		case `${actions.DELETE_STATIC_DATA}_SUCCESS`:
			return state.delete('staticData');
		//修改数据前,初始化数据信息
		case actions.INIT_A_STATIC_DATA_FOR_ADD:
			return state.set('currentStaticData', ret.staticData);
		case `${actions.DEAL_STATIC_DATA}_SUCCESS`:
		default:
			return state;
	}
}
