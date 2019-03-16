'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function DemandAdminReducer (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {

		// 全部需求管理
		case `${actions.QRY_ALL_DEMAND_ENTERISE}_SUCCESS`:{
			return state.set('allDemandInfo', ret);
		}

		//待审核
		case `${actions.QRY_BSN_APPLICATION}_SUCCESS`:{
			return state.set('PendingAuditInfo', ret);
		}

		//需求详细
		case `${actions.QRY_DEMAND_DETAIL}_SUCCESS`:{
			return state.set('allDemandList', ret);
		}

		//审核
		case `${actions.AUDIT_DSN_WORK}_SUCCESS`: {
			return state.set('rspInfo', ret.record );
		}

		//返回清数据
		case actions.QRY_WORK_CLEAR_ID_FORM: {
			return state.set('currentWorksDetail',ret.record);
		}
		//合同消息
		case `${actions.CONTRACT_MSG_LIST}_SUCCESS`: {
			return state.set('contractMsgList',ret.records).set('totalCount',ret.totalCount);
		}


		default:
			return state;
	}
}
