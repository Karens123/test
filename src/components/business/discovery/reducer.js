'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function DiscoveryTypeService (
	state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		//1. 根据条件查询发现列表
		case `${actions.QRY_DISCOVERY_TYPE_BY_FORM}_SUCCESS`://执行查询操作后，清空发现信息列表
			return state.set('discoveryTypeInfoList', ret.records).
				delete('discoveryInfoList');
		//2. 通过id获取一个发现类型数据
		case `${actions.QRY_DISCOVERY_TYPE_BY_ID}_SUCCESS`: {
			const discoveryTypeInfoList = ret.records;
			let currentDiscoveryType = {};
			if (discoveryTypeInfoList && discoveryTypeInfoList[0]) {
				currentDiscoveryType = discoveryTypeInfoList[0];
			}
			return state.set('currentDiscoveryType', currentDiscoveryType);
		}
		//3.  通过发现类型id获取发现信息数据列表
		case `${actions.GET_DISCOVERS_BY_DISCOVERY_TYPE_ID}_SUCCESS`:
			return state.set('discoveryInfoList', ret.records);
		//4. 通过发现信息id获取发现信息数据
		case `${actions.QRY_DISCOVERY_BY_ID}_SUCCESS`: {
			const discoveryInfoList = ret.records;
			let currentDiscovery = {};
			if (discoveryInfoList && discoveryInfoList[0]) {
				currentDiscovery = discoveryInfoList[0];
			}
			return state.set('currentDiscovery', currentDiscovery);
		}
		//5. 初始化一个发现类型用于新增
		case actions.INIT_A_DISCOVERY_TYPE_FOR_ADD:
			return state.set('currentDiscoveryType', ret);
		//6. 初始化一个发现信息用于新增
		case actions.INIT_A_DISCOVERY_FOR_ADD:
			return state.set('currentDiscovery', ret);
		//7. 删除单条发现类型数据
		case `${actions.DEL_DISCOVERY_TYPE}_SUCCESS`:
			return state.delete('currentDiscoveryType');
		//8. 删除单条发现信息数据
		case `${actions.DEL_DISCOVERY}_SUCCESS`:
			return state.delete('currentDiscovery');
		//9. 处理发现类型信息
		case `${actions.DEAL_DISCOVERY_TYPE}_SUCCESS`:
		//10. 处理发现信息
		case `${actions.DEAL_DISCOVERY}_SUCCESS`:
		default:
			return state;
	}
}
