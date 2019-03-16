'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function userIncreStatReducer (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {


		//1 近30日用户走势图
		case `${actions.NEW_USER_ADD_USERS}_SUCCESS`:
			return state.set('usersPieData', ret.usersPieData).set('addNewPieData', ret.addNewPieData);

		//2 昨日用户增长统计
		case `${actions.GTE_BEFORE_DAY_USER_INCRE}_SUCCESS`:
			return state.set('beforeDayRcord', ret.record);

		//3 用户增长统计
		case `${actions.QRY_USER_INCRE_BY_TIME}_SUCCESS`:
			return state.set('UseGrowpStaticAnalysis', ret.records).set('beginTime', ret.beginTime).set('endTime', ret.endTime);

		default:
			return state;
	}
};
