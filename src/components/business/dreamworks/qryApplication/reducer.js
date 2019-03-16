'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function QryApplyReducer (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		//查询设计师申请列表
		case `${actions.QRY_DSN_APPLICATION}_SUCCESS`:{
			return state.set('dsnData', ret);
		}

		//查询商户申请列表
		case `${actions.QRY_BSN_APPLICATION}_SUCCESS`:{
			return state.set('bsnData', ret);
		}

		//查询设计师申请列表
		case `${actions.QRY_DSN_DETAIL}_SUCCESS`:{
			return state.set('dsnDetail', ret);
		}

		//查询商户申请列表
		case `${actions.QRY_BSN_DETAIL}_SUCCESS`:{
			return state.set('bsnDetail', ret);
		}

		//清空设计师申请列表
		case `${actions.CLEAR_DSN_DETAIL}`:{
			return state.set('dsnDetail', ret);
		}

		//清空商户申请列表
		case `${actions.CLEAR_BSN_DETAIL}`:{
			return state.set('bsnDetail', ret);
		}

		//商户审核是否通过
		case `${actions.AUDIT_BSN}_SUCCESS`:{
			return state.set('auditBsn', ret);
		}
		//设计师审核是否通过
		case `${actions.AUDIT_DSN}_SUCCESS`:{
			return state.set('auditDsn', ret);
		}
		case  `${actions.AUDIT_DSN}_SUCCESS`:{
			return state.set('auditDsn', ret);
		}

		default:
			return state;
	}
}
