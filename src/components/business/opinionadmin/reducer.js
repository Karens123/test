'use strict';

import * as Immutable from 'immutable';

import * as actions from 'action';

export default function OpinionService (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	state = Immutable.Map(state).set('actionType', action.type);
	if (ret && ret.rspInfo) {
		state = state.set('rspInfo', ret.rspInfo);
	}
	switch (action.type) {
		//根据form查询意见列表
		case `${actions.QRY_OPINION_BY_FORM}_SUCCESS`:
			return state.set('adviceInfoPicList', []).
				set('adviceInfoList', ret.records);
		//根据form查询意见列表
		case `${actions.QRY_OPINION_BY_ID}_SUCCESS`: {
			let currentAdviceInfo;
			if (ret.records && ret.records[0]) {
				currentAdviceInfo = ret.records[0];
			}
			return state.set('currentAdviceInfo', currentAdviceInfo);
		}
		//查看pic
		case `${actions.QRY_USER_ADVICE_PIC_BY_ADVICE_REC_ID}_SUCCESS`:
			return state.set('adviceInfoPicList', ret.records);
		case `${actions.DELETE_OPINION}_SUCCESS`:
			return state.delete('currentAdviceInfo');
		//处理用户意见处理
		case `${actions.DEAL_OPINION}_SUCCESS`:
		default:
			return state;
	}
}
