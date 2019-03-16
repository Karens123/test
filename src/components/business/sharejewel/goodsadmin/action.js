'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';
import * as Immutable from 'immutable';
import * as CookieUtil from 'utils/CookieUtil';

export const QRY_GOODS_LIST = 'QRY_GOODS_LIST';
export const QRY_INCOME_DISBURSEMENT_DETAILS = 'QRY_INCOME_DISBURSEMENT_DETAILS';
export const DIS_BURSEMENT_PAID = 'DIS_BURSEMENT_PAID';
export const DIS_BURSEMENT_AUDIT = 'DIS_BURSEMENT_AUDIT';
export const SHARE_GOODS_ADMIN = 'SHARE_GOODS_ADMIN';
export const DEAL_SHARE_JEWEL_GOODS ='DEAL_SHARE_JEWEL_GOODS';


export function qryGoodsPages (currentPage=1,pageSize=10,qryForm) {

	return {
		type: QRY_GOODS_LIST,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/goods/pageQry', {
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


export function disbursementAudit (detailsId,channelTradeNo) {

	return {
		type: DIS_BURSEMENT_AUDIT,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/fund/disbursement/audit', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					detailsId,
					channelTradeNo

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



export function dealShareJewelGoods ({ record={},operType }) {
	const userId = CookieUtil.getCookie('userId');
	return {
		type: DEAL_SHARE_JEWEL_GOODS,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/goods/deal', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					userId,
					record
				},
			}),
		},
	};
}


