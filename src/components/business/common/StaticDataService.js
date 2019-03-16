'use strict';

import * as Immutable from 'immutable';
import * as HttpUtil from 'utils/HttpUtil';

//发现类型样式
export const DISCOVERY_TYPE_STYLE = 'BS_DISCOVERY_TYPE_STYLE';
//产品类型
export const UP_PROD_TYPE = 'UP_PROD_TYPE';

export const QRY_STATIC_DATA_BY_ID = 'QRY_STATIC_DATA_BY_ID';

export function getStaticDataByCodeType (codeType) {
	return {
		type: QRY_STATIC_DATA_BY_ID,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/base/qryStaticData', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					qryBean: { codeType },
				},
			}),
		},
	};
}

export function StaticDataService (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		case `${QRY_STATIC_DATA_BY_ID}_SUCCESS`:
			return state.set('staticDataList', ret.records);
		default:
			return state;
	}
}
