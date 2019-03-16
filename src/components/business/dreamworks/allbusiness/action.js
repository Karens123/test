'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

export const QRY_ALLBUSINESS = 'QRY_ALLBUSINESS';



export function qryAllBusiness ({ currentPage=1,pageSize=10,record={} }) {
	return {
		type: QRY_ALLBUSINESS,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/enterprises', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					currentPage,
					pageSize,
					record
				},
			}),
		},
	};
}
