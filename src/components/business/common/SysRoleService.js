'use strict';

import * as Immutable from 'immutable';
import * as HttpUtil from 'utils/HttpUtil';

export const QRY_SYS_ROLE = 'QRY_SYS_ROLE';

export function qrySysRole (sysRole = {}) {
	return {
		type: QRY_SYS_ROLE,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/qrySysRole', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					sysRole,
				},
			}),
		},
	};
}

export function SysRoleService (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		case `${QRY_SYS_ROLE}_SUCCESS`:
			return state.set('sysRoleList', ret.sysRoleList);
		default:
			return state;
	}
}
