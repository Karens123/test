'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function DeviceActivationService (
	state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		case `${actions.QRY_INS_DEVICE}_SUCCESS`:
			return state.set('deviceList', ret.records).
				set('totalCount', ret.totalCount);
		default:
			return state;
	}
}
