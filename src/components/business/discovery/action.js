'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

//1. 通过条件表单查询发现类型列表
export const QRY_DISCOVERY_TYPE_BY_FORM = 'QRY_DISCOVERY_TYPE_BY_FORM';
//2. 通过discoveryId查询单个发现类型数据
export const QRY_DISCOVERY_TYPE_BY_ID = 'QRY_DISCOVERY_TYPE_BY_ID';
//3.根据discoveryTypeId获取图片列表
export const GET_DISCOVERS_BY_DISCOVERY_TYPE_ID = 'GET_DISCOVERS_BY_DISCOVERY_TYPE_ID';
//4.根据discoveryId获取图片列表
export const QRY_DISCOVERY_BY_ID = 'QRY_DISCOVERY_BY_ID';
//5. 删除发现类型
export const DEL_DISCOVERY_TYPE = 'DEL_DISCOVERY_TYPE';
//6. 删除发现信息
export const DEL_DISCOVERY = 'DEL_DISCOVERY';
//7. 初始化一个发现类型用于新增
export const INIT_A_DISCOVERY_TYPE_FOR_ADD = 'INIT_A_DISCOVERY_TYPE_FOR_ADD';
//8. 初始化一个发现信息用于新增
export const INIT_A_DISCOVERY_FOR_ADD = 'INIT_A_DISCOVERY_FOR_ADD';
//9. 发现类型处理
export const DEAL_DISCOVERY_TYPE = 'DEAL_DISCOVERY_TYPE';
//10. 发现信息处理
export const DEAL_DISCOVERY = 'DEAL_DISCOVERY';

//1. 查询发现类型
export function qryDiscoveryByForm (discoveryTypeInfo = {}) {
	return {
		type: QRY_DISCOVERY_TYPE_BY_FORM,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/qryBsDiscoveryType', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					discoveryTypeInfo,
				},
			}),
		},
	};
}

//2. 根据discoveryTypeId查询发现类型数据
export function qryDiscoveryTypeById (discoveryTypeId) {
	return {
		type: QRY_DISCOVERY_TYPE_BY_ID,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/qryBsDiscoveryType', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					discoveryTypeInfo: { discoveryTypeId },
				},
			}),
		},
	};
}

//3. 通过发现类型id获取发现信息数据列表
export function getDiscoverysByDiscoveryTypeId (discoveryType) {
	return {
		type: GET_DISCOVERS_BY_DISCOVERY_TYPE_ID,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/qryBsDiscovery', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					discoveryInfo: { discoveryType },
				},
			}),
		},
	};
}

//4. 通过发现信息id获取发现信息数据
export function qryDiscoveryById (discoveryId) {
	return {
		type: QRY_DISCOVERY_BY_ID,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/qryBsDiscovery', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					discoveryInfo: { discoveryId },
				},
			}),
		},
	};
}

//5. 删除单条发现类型数据
export function deleteDiscoveryType (currentDiscoveryType = {}) {

	return {
		type: DEL_DISCOVERY_TYPE,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/dealBsDiscoveryType',
				{
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						operType: Constant.OPER_TYPE_DELETE,
						discoveryTypeInfoList: [currentDiscoveryType],
					},
				}),
		},
	};
}

//6. 删除单条发现信息数据
export function deleteDiscovery (currentDiscovery = {}) {
	return {
		type: DEL_DISCOVERY,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/dealBsDiscovery', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType: Constant.OPER_TYPE_DELETE,
					discoveryInfoList: [currentDiscovery],
				},
			}),
		},
	};
}

//7. 初始化一个发现类型用于新增
export function initADiscoveryTypeForAdd () {
	return {
		type: INIT_A_DISCOVERY_TYPE_FOR_ADD,
		payload: {},
	};
}

//8. 初始化一个发现信息用于新增
export function initADiscoveryForAdd (discoveryType) {
	return {
		type: INIT_A_DISCOVERY_FOR_ADD,
		payload: { discoveryType },
	};
}

//9. 处理发现类型，新增或者修改
export function dealDiscoveryType (operType, discoveryType) {
	return {
		type: DEAL_DISCOVERY_TYPE,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/dealBsDiscoveryType',
				{
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						operType,
						discoveryTypeInfoList: [discoveryType],
					},
				}),
		},
	};
}

//10. 处理发现信息，新增或者修改
export function dealDiscovery (operType, discovery) {
	return {
		type: DEAL_DISCOVERY,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/dealBsDiscovery', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					discoveryInfoList: [discovery],
				},
			}),
		},
	};
}
