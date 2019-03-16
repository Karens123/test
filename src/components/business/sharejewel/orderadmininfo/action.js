'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

export const ORDER_DETAIL_INFO = 'ORDER_DETAIL_INFO';
export const QRY_ORDER_ALL = 'QRY_ORDER_ALL';
export const ORDER_BACK_GOODS_SUBMIT = 'ORDER_BACK_GOODS_SUBMIT';
export const ORDER_NOTICE_RETURN = 'ORDER_NOTICE_RETURN';



export function dealOrderDetailInfo (ret = {},wenwenId) {
	return {
		type: ORDER_DETAIL_INFO,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/order/send', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					wenwenId,
					record: ret
				},
			}),
		},
	};
}




export function qryOrderAll (ret = {}) {
	return {
		type: QRY_ORDER_ALL,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/order/getOrderFullInfo', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					record: ret
				},
			}),
		},
	};
}

export function BackGoodsHandleSubmit (ret={}) {

	return {
		type: ORDER_BACK_GOODS_SUBMIT,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/order/state/upd', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					...ret
				},
			}),
		},
	};
}


export function OrderNoticeReturn (ret={}) {

	return {
		type: ORDER_NOTICE_RETURN,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/order/notice', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					...ret
				},
			}),
		},
	};
}


export const ORDER_CANCEL_RETURN_PAY = 'ORDER_CANCEL_RETURN_PAY';
export function OrderCancelReturnPay (ret={}) {

	return {
		type: ORDER_CANCEL_RETURN_PAY,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/order/refund', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					...ret
				},
			}),
		},
	};
}



