'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

export const QRY_ICOME_LIST = 'QRY_ICOME_LIST';
export const QRY_INCOME_DISBURSEMENT_DETAILS = 'QRY_INCOME_DISBURSEMENT_DETAILS';
export const QRY_DEMAND_DETAIL ='QRY_DEMAND_DETAIL';



export function qryIcomeList ({ currentPage=1,pageSize=10,qryForm={} }) {
	return {
		type: QRY_ICOME_LIST,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/fund/income/pageQry', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					record: qryForm,
					currentPage,
					pageSize,

				},
			}),
		},
	};
}




export function qryIncomeDisbursementDetails (qryForm) {
	return {
		type: QRY_INCOME_DISBURSEMENT_DETAILS,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/fund/incomeDisbursementDetails', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					record: qryForm,

				},
			}),
		},
	};
}




export function qryDemandDetail (demandId) {
	return {
		type: QRY_DEMAND_DETAIL,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/demand', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					record: {
						demandId
					}
				},
			}),
		},
	};
}
