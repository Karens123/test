'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import moment from 'moment';

export const STAT_DEVICE_INCRE = 'STAT_DEVICE_INCRE';

//昨日设备激活增长统计
export const BEORE_DAY_STAT_DEVICEINCRE = 'BEORE_DAY_STAT_DEVICEINCRE';


// 设备激活增长统计
export function qryDailyDeviceActivationStatInfo (beginTime, endTime, record={}) {
	if (!beginTime || !endTime) {
		if (!endTime) {
			endTime = moment(moment(new Date()).subtract(1, 'days').format('YYYYMMDD')).toDate().getTime();
		}
		if (!beginTime) {
			beginTime = moment(endTime).subtract(7, 'days').toDate().getTime();
		}
	}
	return {
		type: STAT_DEVICE_INCRE,
		payload: {
			promise: HttpUtil.WenwenApi.post(
				'/admin/tenant/statDeviceIncre', {
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						beginTime,
						endTime,
						record
					},
				}),
		},
	};
}

//昨日设备激活增长统计
export function qryBeforeDayStatDeviceIncre () {

	const pubInfo = HttpUtil.getPubInfo();
	return {
		type: BEORE_DAY_STAT_DEVICEINCRE,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/tenant/beforeDayStatDeviceIncre',
				{
					data: {
						pubInfo,
					},
				}),
		},
	};
}
