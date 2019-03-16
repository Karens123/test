'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

export const QRY_All_Designer = 'QRY_All_Designer';
export const QRY_Designer_DEMAND = 'QRY_Designer_DEMAND';
export const QRY_Designer_DETAIL = 'QRY_Designer_DETAIL';




export function qryAllDesigner ({ currentPage=1,pageSize=10,qryForm={} }) {
	return {
		type: QRY_All_Designer,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/dsners', {
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




export function qryDesignerDemand (currentPage=1,pageSize=10,qryForm ) {
	return {
		type: QRY_Designer_DEMAND,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/demand/dsner', {
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



export function getDsnerAggregation (qryForm ) {
	return {
		type: QRY_Designer_DETAIL,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/getDsnerAggregation', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					record: qryForm,
				},
			}),
		},
	};
}