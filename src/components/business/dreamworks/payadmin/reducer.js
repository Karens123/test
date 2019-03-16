'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function qryPayReducer (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {

		// 收入清单
		case `${actions.QRY_PAYOFF_LIST}_SUCCESS`:{
			return state.set('allPayListData', ret);
		}

		// 资金收支明细详情查询
		case `${actions.QRY_INCOME_DISBURSEMENT_DETAILS}_SUCCESS`:{
			return state.set('incomeDisbursementDetails', ret);
		}

		// 资金支出明细审核
		case `${actions.DIS_BURSEMENT_AUDIT}_SUCCESS`:{
			return state.set('disbursement', ret);
		}

		default:
			return state;
	}
}


