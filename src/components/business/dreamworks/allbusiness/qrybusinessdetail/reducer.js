'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function QryBusinessDetail (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		case `${actions.QRY_BUSINESS_DETAIL}_SUCCESS`:{
			return state.set('bsnDetail', ret);
		}
		case `${actions.QRY_DEMAND_LIST}_SUCCESS`:{
			return state.set('demandList', ret);
		}

		default:
			return state;
	}
}