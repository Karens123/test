'use strict';

import * as Immutable from 'immutable';
import * as actions from 'src/components/business/prayeradmin/activityadmin/action';

export default function ActivityService (
	state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		//1. 根据条件查询发现列表
		case `${actions.QRY_ACTIVITY_BY_FORM}_SUCCESS`: { //执行查询操作后，清空发现信息列表
			return state.set('prayerActivityList', ret.records).
				delete('prayerActivityDetailList');
		}
		//2. 通过id获取一个发现类型数据
		case `${actions.QRY_PRAYER_ACTIVITY_BY_ID}_SUCCESS`: {
			const prayerActivity = ret.record;
			const currentActivity = prayerActivity || {};
			return state.set('currentActivity', currentActivity);
		}
		//3.  通过发现类型id获取发现信息数据列表
		case `${actions.GET_PRAYER_ACTIVITY_DETAIL_BY_ACTIVITY_ID}_SUCCESS`:
			return state.set('prayerActivityDetailList', ret.records);
		//4. 通过发现信息id获取发现信息数据
		case `${actions.QRY_ACTIVITY_DETAIL_BY_ID}_SUCCESS`: {
			const currentActivityDetail = ret.record;
			return state.set('currentActivityDetail', currentActivityDetail);
		}
		//5. 初始化一个发现类型用于新增
		case actions.INIT_A_ACTIVITY_FOR_ADD:
			return state.set('currentActivity', ret);
		//6. 初始化一个发现信息用于新增
		case actions.INIT_A_ACTIVITY_DETAIL_FOR_ADD:
			return state.set('currentActivityDetail', ret);
		//7. 删除单条发现类型数据
		case `${actions.DEL_PRAYER_ACTIVITY}_SUCCESS`:
			return state.delete('currentActivity');
		//8. 删除单条发现信息数据
		case `${actions.DEL_PRAYER_ACTIVITY_DETAIL}_SUCCESS`:
			return state.delete('currentActivityDetail');
		//9. 处理发现类型信息
		case `${actions.DEAL_ACTIVITY}_SUCCESS`:
		//10. 处理发现信息
		case `${actions.DEAL_ACTIVITY_DETAIL}_SUCCESS`:
		default:
			return state;
	}
}
