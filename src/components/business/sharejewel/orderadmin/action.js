'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

export const QRY_SHARE_JEWEL_ORDERS = 'QRY_SHARE_JEWEL_ORDERS';
export const QRY_SHARE_JEWEL_ORDERS_RENTING ='QRY_SHARE_JEWEL_ORDERS_RENTING';
//1. 查询列表

export function qryShareJewelOrders ({ record={},currentPage=1,pageSize=10 }) {
	return {
		type: QRY_SHARE_JEWEL_ORDERS,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/order/pageQry', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					currentPage,
					pageSize: 10,
					record,
				},
			}),
		},
	};
}
export function qryShareJewelOrdersRenting ({ record={},pageSize=10,currentPage=1 }) {
	return {
		type: QRY_SHARE_JEWEL_ORDERS_RENTING,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/order/pageQryRenting', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					currentPage,
					pageSize: 10,
					record
				},
			}),
		},
	};
}
