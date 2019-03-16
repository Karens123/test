'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function QryShareJewelOrdersReducer (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		//
		case `${actions.QRY_SHARE_JEWEL_ORDERS}_SUCCESS`:{
			return state.set('orderList', ret);
		}
		case `${actions.QRY_SHARE_JEWEL_ORDERS_RENTING}_SUCCESS`:{
			return state.set('orderList', ret);
		}
		default:
			return state;
	}
}
