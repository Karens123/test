'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function PrayerBeadsApplicationService (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		// 佛珠申领申请列表
		case `${actions.QRY_BEADS_APPLICATION_LIST}_SUCCESS`:{
			return state.set('beadsApplicationList', ret.records);
		}
		default:
			return state;
	}
}


