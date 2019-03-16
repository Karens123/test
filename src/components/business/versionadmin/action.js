'use strict';

import * as HttpUtil from 'utils/HttpUtil';

//1. qryVersion(查询版本信息列表)
export const QRY_VERSION_BY_FORM = 'QRY_VERSION_BY_FORM';
//2. 根据记录id查询版本信息
export const QRY_VERSION_BY_REC_ID = 'QRY_VERSION_BY_REC_ID';
//3. dealVersion(增加/修改/删除版本信息)
export const DEAL_VERSION = 'DEAL_VERSION';
//4. 初始化一个系统用户用于新增
export const INIT_A_VERSION_FOR_ADD = 'INIT_A_VERSION_FOR_ADD';

//1. qryVersion (REST)
export function qryVersion (qryVersion = {}) {
	return {
		type: QRY_VERSION_BY_FORM,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/base/qryVersion', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					qryVersion
				},
			}),
		},
	};
}

//2. qryVersionByRecId (REST)
export function qryVersionByRecId (recId) {
	return {
		type: QRY_VERSION_BY_REC_ID,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/base/qryVersion', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					qryVersion: { recId },
				},
			}),
		},
	};
}

//3. operVersion: 新增，修改, 刪除
export function dealVersion (operType, versionInfoList = []) {
	return {
		type: DEAL_VERSION,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/base/dealVersion', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					versionInfoList,
				},
			}),
		},
	};
}

//4. 初始化一个系统用户用于新增
export function initAVersionForAdd () {
	return {
		type: INIT_A_VERSION_FOR_ADD,
		payload: {},
	};
}
