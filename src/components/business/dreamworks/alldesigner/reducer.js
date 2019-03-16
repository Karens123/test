'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function QryAllDesignerReducer (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		//查询设计师申请列表
		case `${actions.QRY_All_Designer}_SUCCESS`:{
			return state.set('data', ret);
		}
		case `${actions.QRY_Designer_DEMAND}_SUCCESS`:{
			return state.set('desDemandInfro', ret);
		}
		case `${actions.QRY_Designer_DETAIL}_SUCCESS`:{
			return state.set('desnerInfo', ret);
		}

		default:
			return state;
	}
}