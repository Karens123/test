'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function reducer (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		//版本信息查询成功
		case `${actions.QRY_VERSION_BY_FORM}_SUCCESS`:
			return state.set('versionInfoList', ret.records);
		//版本信息查询成功
		case `${actions.QRY_VERSION_BY_REC_ID}_SUCCESS`: {
			let currentVersion;
			if (ret.records && ret.records[0]) {
				currentVersion = ret.records[0];
			}
			return state.set('currentVersion', currentVersion);
		}
		case actions.INIT_A_VERSION_FOR_ADD:
			return state.set('currentVersion', ret);
		//版本信息设置成功
		case `${actions.DEAL_VERSION}_SUCCESS`:
		default:
			return state;
	}
}
