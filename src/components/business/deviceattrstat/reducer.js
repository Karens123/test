'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function DeviceAttrStat (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		// 设备属性整合统计
		case `${actions.STAT_DEVICE_ATTR_AGGREGATION}_SUCCESS`:
			return state.set('deviceAttrAggregationRecord', ret.record);
		default:
			return state;
	}
}
