'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

export const QRY_PAYOFF_LIST = 'QRY_PAYOFF_LIST';




export function qrypendingsettlement ({ currentPage,pageSize,record }) {

	return {
		type: QRY_PAYOFF_LIST,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/dsners', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					record,
					currentPage: 1,
					pageSize: 10,

				},
			}),
		},
	};
}


