'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import moment from 'moment';

//设备属性整合统计
export const STAT_DEVICE_ATTR_AGGREGATION = 'STAT_DEVICE_ATTR_AGGREGATION';

// 设备属性整合统计
export function statDeviceAttrAggregation (statDate = Date.now()) {
	return {
		type: STAT_DEVICE_ATTR_AGGREGATION,
		payload: {
			promise: HttpUtil.WenwenApi.post(
				'/admin/tenant/statDeviceAttrAggregation', {
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						statDate
					},
				}),
		},
	};
}

