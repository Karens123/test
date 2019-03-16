'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import moment from 'moment';

//用户属性整合统计
export const STAT_USER_ATTR_AGGREGATION = 'STAT_USER_ATTR_AGGREGATION';

// 用户属性整合统计
export function statUserAttrAggregation (statDate = Date.now()) {
	return {
		type: STAT_USER_ATTR_AGGREGATION,
		payload: {
			promise: HttpUtil.WenwenApi.post(
				'/admin/tenant/statUserAttrAggregation', {
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						statDate ,
					},
				}),
		},
	}
		;
}

