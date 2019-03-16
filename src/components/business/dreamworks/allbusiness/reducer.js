'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function QryBusinessReducer (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		//查询设计师申请列表
		case `${actions.QRY_ALLBUSINESS}_SUCCESS`:{
			return state.set('allBusiness', ret);
		}

		default:
			return state;
	}
}