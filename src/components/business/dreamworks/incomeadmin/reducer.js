'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function qryIcomeReducer (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {

		// 收入清单
		case `${actions.QRY_ICOME_LIST}_SUCCESS`:{
			return state.set('iconeList', ret);
		}

		// 资金收支明细详情查询
		case `${actions.QRY_INCOME_DISBURSEMENT_DETAILS}_SUCCESS`:{
			return state.set('incomeDisbursementDetails', ret);
		}

		//需求详细
		case `${actions.QRY_DEMAND_DETAIL}_SUCCESS`:{
			return state.set('demandDetail', ret);
		}
		default:
			return state;
	}
}
