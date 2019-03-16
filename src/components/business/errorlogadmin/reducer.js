'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function ErrorLogService (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		//错误消息
		case `${actions.QRY_ERROR_LOG_BY_FORM}_SUCCESS`:
			return state.set('errorLogList', ret.records);
		//编辑错误信息初始化
		case `${actions.GET_ERROR_LOG_BY_ID}_SUCCESS`: {
			let currentErrorLog;
			if (ret.records && ret.records[0]) {
				currentErrorLog = ret.records[0];
			}
			return state.set('currentErrorLog', currentErrorLog);
		}
		//编辑错误信息
		case `${actions.DEAL_ERROR_LOG}_SUCCESS`:
		default:
			return state;
	}
}
