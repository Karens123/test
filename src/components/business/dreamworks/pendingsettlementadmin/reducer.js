'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function qryPendingsettlementadminReducer (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {

		// 收入清单
		case `${actions.QRY_PAYOFF_LIST}_SUCCESS`:{
			console.log('ret____________', ret);
			return state.set('SettlementData', ret);
		}

		default:
			return state;
	}
}
