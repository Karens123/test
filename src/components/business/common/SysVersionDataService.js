'use strict';

import * as Immutable from 'immutable';
import * as HttpUtil from 'utils/HttpUtil';

export const QRY_SYS_VERSION_DATA = 'QRY_SYS_VERSION_DATA';
export function qrySysVersionData (qryVersion = {}) {
	return {
		type: QRY_SYS_VERSION_DATA,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/base/qryVersion', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					qryVersion,
				},
			}),
		},
	};
}

export function SysVersionDataService (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		case `${QRY_SYS_VERSION_DATA}_SUCCESS`:
			return state.set('versionInfoList', ret.records);
		default:
			return state;
	}
}
