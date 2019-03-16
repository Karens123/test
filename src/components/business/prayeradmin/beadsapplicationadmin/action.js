'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';
import * as Immutable from 'immutable';
import * as CookieUtil from 'utils/CookieUtil';

export const QRY_BEADS_APPLICATION_LIST = 'QRY_BEADS_APPLICATION_LIST';
export const ASSIGN_BEADS = 'ASSIGN_BEADS';

export function qryBeadsApplication (record={}, stateList=[], currentPage=1, pageSize=10, ) {
	return {
		type: QRY_BEADS_APPLICATION_LIST,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prayer/beadsApplication/list', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					record,
					stateList,
					currentPage,
					pageSize,

				},
			}),
		},
	};
}

export function assignBeads (record={}) {
	return {
		type: ASSIGN_BEADS,
		payload: {
			promise: HttpUtil.WenwenApi.post(
				'/admin/prayer/beadsApplication/deal', {
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						operType: 1,
						record,
					},
				}),
		},
	};
}


