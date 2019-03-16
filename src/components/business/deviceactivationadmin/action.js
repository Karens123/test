'use strict';

import * as HttpUtil from 'utils/HttpUtil';

export const QRY_INS_DEVICE = 'QRY_INS_DEVICE';

//查询设备
export function qryDevice (
	qryBean = {}, currentPage = 1, pageSize = 10, beginActivitedTime,
	endActivitedTime) {
	const pubInfo = HttpUtil.getPubInfo();
	return {
		type: QRY_INS_DEVICE,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/sys/qryDeviceActivateInfo',
				{
					data: {
						pubInfo,
						qryBean,
						currentPage,
						pageSize,
						beginActivitedTime,
						endActivitedTime,
					},
				}),
		},
	};
}
