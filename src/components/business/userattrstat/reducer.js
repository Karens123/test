'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function UserAttrStat (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		// 用户属性整合统计
		case `${actions.STAT_USER_ATTR_AGGREGATION}_SUCCESS`:
			return state.set('userAttrAggregationRecord', ret.record);
		default:
			return state;
	}
}
