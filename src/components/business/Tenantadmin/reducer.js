'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function TenantService (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {

		//1. 查询租户
		case `${actions.QRY_TENANT_BY_FORM}_SUCCESS`:
			return state.set('TenantRecords', ret.records);

		//2. 查询租户
		case `${actions.DEAL_TENANT}_SUCCESS`:
			return state.set('records', ret.records);

		//3. 初始化租户
		case actions.INIT_EDIT_TENANT:
			return state.set('currentSelectTenant', ret.currentSelectTenant);


		default:
			return state;
	}
}
