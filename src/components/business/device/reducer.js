'use strict';

import * as actions from 'action';
import * as Immutable from 'immutable';

export default function DeviceService (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		case `${actions.PAGE_QRY_DEVICE_BY_FORM}_SUCCESS`:
			return state.set('deviceInfoList', ret.records).
				set('total', ret.totalCount);
		case `${actions.QRY_PROD_FOR_SELECT}_SUCCESS`:
			return state.set('prodInfoList', ret.records);
		case `${actions.QRY_TENANT_FOR_SELECT}_SUCCESS`:
			return state.set('tenantList', ret.records);
		case `${actions.GEN_DEVICE_SN}_SUCCESS`:
			return state.set('existDeviceSnList', ret.existDeviceSnList);
		case `${actions.IMPORT_DEVICE_SN_BY_EXCEL}_SUCCESS`:
			console.log('illegalDeviceSnList: ', ret.illegalDeviceSnList);
			return state.set('existDeviceSnList', ret.existDeviceSnList).
				set('illegalDeviceSnList', ret.illegalDeviceSnList);
		case actions.COMPLATE_REFRESH:
			return state.set('loading', false);
		case `${actions.DEL_DEVICE}_SUCCESS`:
		default:
			return state;
	}
}
