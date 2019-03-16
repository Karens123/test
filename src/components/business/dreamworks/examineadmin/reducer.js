'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function EnterExamineReducer (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {

		//1. 根据条件查询发现列表
		case `${actions.QRY_ALLBUSINESSES_FORM}_SUCCESS`:{
			return state.set('WorksInfoList', ret.records)
				.set('totalCount',ret.totalCount);
		}
		//2.查询作品详情
		case `${actions.QRY_WORK_DETAIL_ID_FORM}_SUCCESS`: {
			let currentWorksDetailInfo={};
			if (ret.record ) {
				currentWorksDetailInfo = ret.record;
			}
			return state.set('currentWorksDetail', currentWorksDetailInfo );
		}

		//3.返回清数据
		case actions.QRY_WORK_CLEAR_ID_FORM: {
			return state.set('currentWorksDetail',ret.record);
		}

		//4.审核
		case `${actions.AUDIT_DSN_WORK}_SUCCESS`: {
			return state.set('rspInfo', ret.record );
		}


		//5.商家待审核需求列表分页
		case `${actions.QRY_ALLDEMAIND_FORM}_SUCCESS`:{
			return state.set('demandInfoList', ret.records)
				.set('demandTotalCount',ret.totalCount);
		}

		//6.设计师需求详细
		case `${actions.QRY_DEMAND_ID_FORM}_SUCCESS`: {
			let currentDemandDetailInfo={};
			return state.set('currentDemandDetailInfo', ret && ret.record ? currentDemandDetailInfo=ret.record : {});
		}

		default:
			return state;
	}
}
