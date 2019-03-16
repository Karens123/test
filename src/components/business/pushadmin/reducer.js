'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function PushService (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		//通知记录
		case `${actions.QRY_PUSH_INFO_BY_FORM}_SUCCESS`:
			return state.set('pushInfoList', ret.records);
		case `${actions.QRY_PUSH_INFO_BY_ID}_SUCCESS`: {
			let currentPushInfo;
			if (ret.records && ret.records[0]) {
				currentPushInfo = ret.records[0];
			}
			return state.set('currentPushInfo', currentPushInfo);
		}
		//通知统计
		case `${actions.QRY_PUSH_STATINFOR}_SUCCESS`:
			return state.set('pushStatInfo', ret.pushStatInfo);
		//信息,通知处理
		case `${actions.DEAL_PUSH_INFORMATION}_SUCCESS`:
		//推送重发
		case `${actions.PUSH_NOTIFICATION_MESSAGE}_SUCCESS`:
		//发送通知
		case `${actions.PUSH_NOTIFICATION}_SUCCESS`:
		//发送消息
		case `${actions.PUSH_MESSAGE}_SUCCESS`:
		default:
			return state;
	}
}
