'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

export const QRY_PAYOFF_LIST = 'QRY_PAYOFF_LIST';
export const QRY_INCOME_DISBURSEMENT_DETAILS = 'QRY_INCOME_DISBURSEMENT_DETAILS';
export const DIS_BURSEMENT_PAID = 'DIS_BURSEMENT_PAID';
export const DIS_BURSEMENT_AUDIT = 'DIS_BURSEMENT_AUDIT';


export function qryPayAdmin (currentPage=1,pageSize=10,qryForm) {
	return {
		type: QRY_PAYOFF_LIST,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/fund/disbursement/pageQry', {
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


export function disbursementAudit (detailsId) {
	return {
		type: DIS_BURSEMENT_AUDIT,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/fund/disbursement/audit', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					detailsId,

				},
			}),
		},
	};
}


export function disbursementPaid (detailsId,channelTradeNo) {
	return {
		type: DIS_BURSEMENT_PAID,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/fund/disbursement/paid', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					detailsId,
					channelTradeNo,
				},
			}),
		},
	};
}

