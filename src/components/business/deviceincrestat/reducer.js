'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function DeviceIncreStat (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {

		//设备激活增长统计
		case `${actions.STAT_DEVICE_INCRE}_SUCCESS`:
			return state.set('dailyStatDeviceIncreList', ret.records).set('beginTime', ret.beginTime).set('endTime', ret.endTime);
		//昨日设备激活增长统计
		case `${actions.BEORE_DAY_STAT_DEVICEINCRE}_SUCCESS`: {
			let beforeDeviceList;
			if (ret.record==undefined) {
				beforeDeviceList={};
			}
			return state.set('beforeDeviceList', ret.record);
		}
		default:
			return state;
	}
}
