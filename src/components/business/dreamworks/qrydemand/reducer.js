'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function QryDemandReducer (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		//查询设计师申请列表
		case `${actions.QRY_DEMAND_DETAIL}_SUCCESS`:{
			console.log('here we go',ret);
			return state.set('demand', ret);
		}
		case  `${actions.AUDIT_DEMAND}_SUCCESS`:{
			console.log('here we go',ret);
			return state.set('auditDemand', ret);
		}
		case `${actions.CLEAR_DEMAND_DETAIL}_SUCCESS`:{
			return state.set('demand', ret);
		}

		default:
			return state;
	}
}