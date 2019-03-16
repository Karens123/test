'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function appStatistic (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		//系统新闻
		case `${actions.SYSTREM_MESSAGES}_SUCCESS`:
			return state.set('sysMsg', ret.sysMsg).set('refreshData', false);

		//系统新用户
		case `${actions.SYSTREM_NEW_USERS}_SUCCESS`:
			return state.set('newUsersList', ret.newUsers);

		//近30日用户走势图
		case `${actions.NEW_USER_CHART}_SUCCESS`:
			return state.set('usersChartLastDay', []).
				set('usersChartLastDay', ret.usersChartLastDay);

		case `${actions.NEW_USER_ADD_USERS}_SUCCESS`:
			return state.set('usersPieData', ret.usersPieData).
				set('addNewPieData', ret.addNewPieData);

		//5.用户整体统计分析
		case `${actions.USERS_WHOLE_STATISTIC}_SUCCESS`:
			return state.set('refreshData', false).
				set('useWholeStatistic', []).
				set('useWholeStatistic', ret.useWholeStatistic);

		//6.新增新用户
		case `${actions.USERS_NEW_ADD}_SUCCESS`:
			return state.set('newUserList', ret.newUserList);

		//7.活跃新用户
		case `${actions.STAT_ACTIVE_USER}_SUCCESS`:
			return state.set('activeUserList', ret.statActiveUser);
		//8.硬件统计
		case `${actions.HARWARE_CONT_STAISTIC}_SUCCESS`:
			return state.set('records', ret.records);
		//9.硬件连接明细查询接口
		case `${actions.HARWARE_CONNCENT_DEATIL}_SUCCESS`:
			return state.set('recordsDetail', ret.records);
		default:
			return state;
	}
}
